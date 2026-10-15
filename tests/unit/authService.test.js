const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../backend/src/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const User = require("../../backend/src/models/User");
const {
  registerUser,
  loginUser,
} = require("../../backend/src/services/authService");

const TEST_SECRET = "test-only-secret-for-jest-do-not-use-in-production";

function makeUser(overrides = {}) {
  return {
    _id: {
      toString: () => "test-user-id",
    },
    name: "Test Student",
    email: "student.test@example.com",
    role: "student",
    isActive: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    passwordHash: "unused-hash",
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("Authentication service", () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalExpiry = process.env.JWT_EXPIRES_IN;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = TEST_SECRET;
    process.env.JWT_EXPIRES_IN = "1d";
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }

    if (originalExpiry === undefined) {
      delete process.env.JWT_EXPIRES_IN;
    } else {
      process.env.JWT_EXPIRES_IN = originalExpiry;
    }
  });

  describe("registerUser", () => {
    test("creates a user with a hashed password", async () => {
      User.findOne.mockResolvedValue(null);

      const savedUser = makeUser();
      User.create.mockResolvedValue(savedUser);

      const result = await registerUser({
        name: " Test Student ",
        email: " STUDENT.TEST@example.com ",
        password: "StudentTest@123",
        role: "student",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        email: "student.test@example.com",
      });

      expect(User.create).toHaveBeenCalledTimes(1);

      const createdData = User.create.mock.calls[0][0];

      expect(createdData.name).toBe("Test Student");
      expect(createdData.email).toBe("student.test@example.com");
      expect(createdData.role).toBe("student");
      expect(createdData.passwordHash).not.toBe("StudentTest@123");
      await expect(
        bcrypt.compare("StudentTest@123", createdData.passwordHash),
      ).resolves.toBe(true);

      expect(result).not.toHaveProperty("passwordHash");
      expect(result).not.toHaveProperty("password");
      expect(result.email).toBe("student.test@example.com");
    });

    test("rejects a duplicate email", async () => {
      User.findOne.mockResolvedValue(makeUser());

      await expect(
        registerUser({
          name: "Test Student",
          email: "student.test@example.com",
          password: "StudentTest@123",
          role: "student",
        }),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "An account with this email already exists",
      });

      expect(User.create).not.toHaveBeenCalled();
    });

    test("rejects public admin registration", async () => {
      await expect(
        registerUser({
          name: "Test Admin",
          email: "admin.test@example.com",
          password: "AdminTest@123",
          role: "admin",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(User.create).not.toHaveBeenCalled();
    });

    test("rejects a password exceeding 72 UTF-8 bytes", async () => {
      await expect(
        registerUser({
          name: "Test Student",
          email: "student.longpassword@example.com",
          password: "é".repeat(37),
          role: "student",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message:
          "Password must contain at least 8 characters and no more than 72 UTF-8 bytes",
      });

      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    test("logs in and returns a valid JWT", async () => {
      const passwordHash = await bcrypt.hash("StudentTest@123", 4);

      const user = makeUser({ passwordHash });
      User.findOne.mockResolvedValue(user);

      const result = await loginUser({
        email: " STUDENT.TEST@example.com ",
        password: "StudentTest@123",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        email: "student.test@example.com",
      });

      expect(user.save).toHaveBeenCalledTimes(1);
      expect(user.lastLoginAt).toBeInstanceOf(Date);

      expect(result.user).not.toHaveProperty("passwordHash");
      expect(result.user).not.toHaveProperty("password");

      const decoded = jwt.verify(result.token, TEST_SECRET, {
        issuer: "cprmp-api",
        audience: "cprmp-client",
      });

      expect(decoded.sub).toBe("test-user-id");
      expect(decoded.role).toBe("student");
    });

    test("rejects an incorrect password", async () => {
      const passwordHash = await bcrypt.hash("CorrectPassword@123", 4);

      User.findOne.mockResolvedValue(makeUser({ passwordHash }));

      await expect(
        loginUser({
          email: "student.test@example.com",
          password: "WrongPassword@123",
        }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });

    test("rejects an unknown email", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        loginUser({
          email: "unknown@example.com",
          password: "StudentTest@123",
        }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });
    });

    test("rejects an inactive account", async () => {
      const passwordHash = await bcrypt.hash("StudentTest@123", 4);

      const user = makeUser({
        passwordHash,
        isActive: false,
      });

      User.findOne.mockResolvedValue(user);

      await expect(
        loginUser({
          email: "student.test@example.com",
          password: "StudentTest@123",
        }),
      ).rejects.toMatchObject({
        statusCode: 403,
        message: "This account is inactive",
      });

      expect(user.save).not.toHaveBeenCalled();
    });

    test("rejects login when JWT_SECRET is missing", async () => {
      const passwordHash = await bcrypt.hash("StudentTest@123", 4);

      User.findOne.mockResolvedValue(makeUser({ passwordHash }));

      delete process.env.JWT_SECRET;

      await expect(
        loginUser({
          email: "student.test@example.com",
          password: "StudentTest@123",
        }),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "JWT_SECRET is not configured",
      });
    });
  });
});
