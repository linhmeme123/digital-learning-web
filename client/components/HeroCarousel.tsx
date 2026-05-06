'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { carouselItems } from '@/lib/mock-data'

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoPlay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % carouselItems.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
    setAutoPlay(false)
  }

  const item = carouselItems[current]

  return (
    <div 
      className="relative h-96 md:h-96 rounded-lg overflow-hidden shadow-lg group"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ background: item.image }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
        <div className="text-center space-y-4 max-w-2xl px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">{item.title}</h2>
          <p className="text-lg md:text-xl text-gray-100">{item.description}</p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg transition-shadow">
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/30 hover:bg-white/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Trước"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/30 hover:bg-white/50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Tiếp"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoPlay(false)
            }}
            className={`h-2 rounded-full transition-all ${
              index === current
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
