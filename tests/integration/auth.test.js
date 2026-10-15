const request = require("supertest");

jest.mock("../../backend/src/services/authService", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

const authService = require("../../backend/src/services/authService");
const app = require("../../backend/src/app");

describe("CPRMP Authentication API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    test("registers a valid student and returns 201", async () => {
      authService.registerUser.mockResolvedValue({
        id: "test-user-id",
        name: "Test Student",
        email: "student.test@example.com",
        role: "student",
        isActive: true,
      });

      const response = await request(app).post("/api/auth/register").send({
        name: "Test Student",
        email: "student.test@example.com",
        password: "StudentTest@123",
        role: "student",
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe("student.test@example.com");
      expect(authService.registerUser).toHaveBeenCalledTimes(1);
    });

    test("rejects missing registration fields", async () => {
      const response = await request(app).post("/api/auth/register").send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors.length).toBeGreaterThan(0);
      expect(authService.registerUser).not.toHaveBeenCalled();
    });

    test("rejects admin self-registration", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test Admin",
        email: "admin.test@example.com",
        password: "AdminTest@123",
        role: "admin",
      });

      expect(response.status).toBe(400);
      expect(authService.registerUser).not.toHaveBeenCalled();
    });

    test("returns the service error for duplicate email", async () => {
      authService.registerUser.mockRejectedValue(
        Object.assign(new Error("An account with this email already exists"), {
          statusCode: 409,
        }),
      );

      const response = await request(app).post("/api/auth/register").send({
        name: "Test Student",
        email: "student.test@example.com",
        password: "StudentTest@123",
        role: "student",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "An account with this email already exists",
      );
    });

    test("rejects a password exceeding 72 UTF-8 bytes", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test Student",
          email: "student.longpassword@example.com",
          password: "é".repeat(37),
          role: "student",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(authService.registerUser).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/login", () => {
    test("logs in and returns a JWT and user", async () => {
      authService.loginUser.mockResolvedValue({
        token: "test-only-jwt-token",
        user: {
          id: "test-user-id",
          name: "Test Student",
          email: "student.test@example.com",
          role: "student",
          isActive: true,
        },
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "student.test@example.com",
        password: "StudentTest@123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data.token).toBe("test-only-jwt-token");
      expect(response.body.data.user.email).toBe("student.test@example.com");
      expect(authService.loginUser).toHaveBeenCalledTimes(1);
    });

    test("rejects missing login fields", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Validation failed");
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    test("returns 401 for invalid credentials", async () => {
      authService.loginUser.mockRejectedValue(
        Object.assign(new Error("Invalid email or password"), {
          statusCode: 401,
        }),
      );

      const response = await request(app).post("/api/auth/login").send({
        email: "student.test@example.com",
        password: "WrongPassword@123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });
});
