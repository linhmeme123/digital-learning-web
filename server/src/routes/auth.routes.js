const express = require('express');

const {
  signup,
  login,
  getMe,
  logout,
} = require('../controllers/auth.controller');

const { authGuard } = require('../middlewares/authGuard');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authGuard, getMe);
router.post('/logout', logout);

module.exports = router;