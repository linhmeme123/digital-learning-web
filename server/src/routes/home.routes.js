const express = require('express');

const {
  getHomeContent,
  updateHomeContent,
} = require('../controllers/home.controller');
const { authGuard } = require('../middlewares/authGuard');
const { roleGuard } = require('../middlewares/roleGuard');

const router = express.Router();

router.get('/', getHomeContent);
router.patch('/', authGuard, roleGuard(['ADMIN']), updateHomeContent);

module.exports = router;
