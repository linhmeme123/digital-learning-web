'use client'

import { MapPin, Phone, Mail, Facebook } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Lớp Học Số
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trung tâm giáo dục sử dụng công nghệ mới
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Khóa học
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Giáo viên
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Thông Tin Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Nhà 2B, ngõ 14 Hồ Đắc Di, Đống Đa, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-purple-400" />
                <a href="tel:0123456789" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  0902189774
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-purple-400" />
                <a href="mailto:info@lophocso.edu.vn" className="text-gray-400 hover:text-purple-400 transition-colors text-sm break-all">
                  badohanglqd@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-4">Kết Nối Với Chúng Tôi</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100063719461804"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-gray-700 hover:bg-purple-600 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-gray-700 text-sm font-black hover:bg-purple-600 transition-colors"
                aria-label="TikTok"
              >
                T
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
