const AuthService = require('../services/auth.service');

const TOKEN_COOKIE_NAME = 'access_token';

function setAuthCookie(res, token) {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function signup(req, res) {
  try {
    const result = await AuthService.signup(req.body);

    setAuthCookie(res, result.token);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi đăng ký',
    });
  }
}

async function login(req, res) {
  try {
    const result = await AuthService.login(req.body);

    setAuthCookie(res, result.token);

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi đăng nhập',
    });
  }
}

function getMe(req, res) {
  return res.json({
    success: true,
    message: 'Lấy thông tin người dùng thành công',
    data: {
      user: req.user,
    },
  });
}

function logout(req, res) {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.json({
    success: true,
    message: 'Đăng xuất thành công',
  });
}

module.exports = {
  signup,
  login,
  getMe,
  logout,
};