const { verifyToken } = require('../utils/jwt');
const AuthService = require('../services/auth.service');

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }

  return null;
}

async function authGuard(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập',
      });
    }

    const decoded = verifyToken(token);

    const user = await AuthService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc token không hợp lệ',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa',
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
    });
  }
}

module.exports = {
  authGuard,
};