
const {
  registerUser,
  loginUser,
} = require('../services/authService');

async function register(req, res) {
  const { name, email, password, role } = req.body || {};

  const user = await registerUser({
    name,
    email,
    password,
    role,
  });

  return res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user,
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body || {};

  const result = await loginUser({
    email,
    password,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      token: result.token,
      user: result.user,
    },
  });
}

module.exports = {
  register,
  login,
};
