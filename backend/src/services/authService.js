const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = 12;

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

function createAccessToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw createError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign({ role: user.role }, secret, {
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    issuer: "cprmp-api",
    audience: "cprmp-client",
  });
}

async function registerUser({ name, email, password, role = "student" }) {
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw createError("Name, email, and password are required", 400);
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    throw createError("Name must contain 2 to 100 characters", 400);
  }

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    throw createError("Please provide a valid email address", 400);
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    throw createError(
      "Password must contain at least 8 characters and no more than 72 UTF-8 bytes",
      400,
    );
  }

  // Admin accounts must be provisioned separately.
  if (!["student", "recruiter"].includes(role)) {
    throw createError(
      "Public registration supports student or recruiter roles only",
      400,
    );
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw createError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role,
    });

    return toPublicUser(user);
  } catch (error) {
    if (error.code === 11000) {
      throw createError("An account with this email already exists", 409);
    }

    throw error;
  }
}

async function loginUser({ email, password }) {
  if (typeof email !== "string" || typeof password !== "string") {
    throw createError("Email and password are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    password.length === 0 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw createError("Invalid email or password", 401);
  }

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw createError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw createError("This account is inactive", 403);
  }

  const token = createAccessToken(user);

  user.lastLoginAt = new Date();
  await user.save();

  return {
    token,
    user: toPublicUser(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
};
