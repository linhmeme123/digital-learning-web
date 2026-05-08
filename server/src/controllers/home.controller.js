const HomeService = require('../services/home.service');
const { logError } = require('../utils/logger');

async function getHomeContent(req, res) {
  try {
    const home = await HomeService.getHomeContent();

    return res.json({
      success: true,
      message: 'Lấy nội dung trang chủ thành công',
      data: {
        home,
      },
    });
  } catch (error) {
    logError(req, error, 'getHomeContent failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi lấy nội dung trang chủ',
    });
  }
}

async function updateHomeContent(req, res) {
  try {
    const home = await HomeService.updateHomeContent(req.body);

    return res.json({
      success: true,
      message: 'Cập nhật nội dung trang chủ thành công',
      data: {
        home,
      },
    });
  } catch (error) {
    logError(req, error, 'updateHomeContent failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi cập nhật nội dung trang chủ',
    });
  }
}

module.exports = {
  getHomeContent,
  updateHomeContent,
};
