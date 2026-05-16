const prisma = require('../db/prisma');

const HOME_ID = 1;

const defaultHomeContent = {
  heroSlides: [
    {
      id: 1,
      title: 'Môn Toán',
      description: 'Khóa học tư duy nền tảng từ cơ bản đến nâng cao',
      image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  ],
  introductionTitle: 'Về Lớp Học Số',
  introductionBody: [
    'Lớp Học Số là một trung tâm giáo dục ứng dụng công nghệ để giúp học viên học tập linh hoạt, có lộ trình và có người đồng hành.',
    'Với đội ngũ giáo viên có kinh nghiệm và phương pháp giảng dạy hiện đại, chúng tôi giúp học viên nắm vững kiến thức và tự tin tiến bộ.',
  ],
  achievements: [
    { icon: '🎓', title: '5 năm kinh nghiệm', description: 'Giảng dạy liên tục và cải tiến chương trình học' },
    { icon: '👥', title: '2000+ học viên', description: 'Đồng hành cùng nhiều thế hệ học viên' },
    { icon: '⭐', title: '4.9/5 đánh giá', description: 'Chất lượng học tập được học viên xác nhận' },
    { icon: '🏆', title: 'Giáo viên chất lượng', description: 'Đội ngũ giáo viên có chuyên môn và kinh nghiệm thực tế' },
  ],
  mission: 'Trang bị cho học viên kiến thức nền tảng, tư duy tự học và kỹ năng giải quyết vấn đề.',
  vision: 'Trở thành môi trường học tập số đáng tin cậy, nơi học viên có thể phát triển toàn diện và bền vững.',
  coreValues: [
    { title: 'Chất Lượng', description: 'Đảm bảo chất lượng giáo dục cao nhất' },
    { title: 'Sáng Tạo', description: 'Khuyến khích sự sáng tạo và đổi mới' },
    { title: 'Cộng Tác', description: 'Hợp tác với học viên để đạt mục tiêu chung' },
    { title: 'Tiên Phong', description: 'Luôn theo dõi và áp dụng công nghệ mới' },
  ],
};

function toHomeResponse(homeContent) {
  return {
    id: homeContent.id,
    heroSlides: homeContent.heroSlides,
    introductionTitle: homeContent.introductionTitle,
    introductionBody: homeContent.introductionBody,
    achievements: homeContent.achievements,
    mission: homeContent.mission,
    vision: homeContent.vision,
    coreValues: homeContent.coreValues,
    createdAt: homeContent.createdAt,
    updatedAt: homeContent.updatedAt,
  };
}

async function getHomeContent() {
  const homeContent = await prisma.homeContent.upsert({
    where: {
      id: HOME_ID,
    },
    update: {},
    create: {
      id: HOME_ID,
      ...defaultHomeContent,
    },
  });

  return toHomeResponse(homeContent);
}

async function updateHomeContent(payload) {
  await getHomeContent();

  const updateData = Object.fromEntries(
    Object.entries({
      heroSlides: payload.heroSlides,
      introductionTitle: payload.introductionTitle?.trim(),
      introductionBody: payload.introductionBody,
      achievements: payload.achievements,
      mission: payload.mission?.trim(),
      vision: payload.vision?.trim(),
      coreValues: payload.coreValues,
    }).filter(([, value]) => value !== undefined && value !== '')
  );

  const homeContent = await prisma.homeContent.update({
    where: {
      id: HOME_ID,
    },
    data: updateData,
  });

  return toHomeResponse(homeContent);
}

module.exports = {
  defaultHomeContent,
  getHomeContent,
  updateHomeContent,
};
