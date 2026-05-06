'use client'

import { achievements } from '@/lib/mock-data'

export default function AboutTab() {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Về Lớp Học Số</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-4">
          Lớp Học Số là một trung tâm giáo dục chuyên về công nghệ thông tin, lập trình, và phát triển phần mềm. 
          Chúng tôi cam kết cung cấp giáo dục chất lượng cao với các khóa học được thiết kế bởi các chuyên gia trong ngành.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          Với đội ngũ giáo viên có kinh nghiệm và phương pháp giảng dạy hiện đại, chúng tôi giúp học viên không chỉ 
          nắm vững kiến thức lý thuyết mà còn phát triển kỹ năng thực hành cần thiết cho sự nghiệp.
        </p>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Những Thành Tích</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {achievement.title}
              </h4>
              <p className="text-gray-600">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-purple-600">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ Mệnh</h3>
          <p className="text-gray-600 leading-relaxed">
            Trang bị cho học viên những kỹ năng lập trình và kiến thức công nghệ cần thiết để thành công 
            trong sự nghiệp ngành công nghệ thông tin.
          </p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-pink-600">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm Nhìn</h3>
          <p className="text-gray-600 leading-relaxed">
            Trở thành một trong những trung tâm giáo dục công nghệ hàng đầu, nơi sinh viên có thể phát triển 
            toàn diện và chuẩn bị tốt nhất cho tương lai.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Giá Trị Cốt Lõi</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-xl">✓</span>
            <span><strong>Chất Lượng:</strong> Đảm bảo chất lượng giáo dục cao nhất</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">✓</span>
            <span><strong>Sáng Tạo:</strong> Khuyến khích sự sáng tạo và đổi mới</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">✓</span>
            <span><strong>Cộng Tác:</strong> Hợp tác với các học viên để đạt mục tiêu chung</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">✓</span>
            <span><strong>Tiên Phong:</strong> Luôn theo dõi và áp dụng công nghệ mới nhất</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
