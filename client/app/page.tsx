'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroCarousel from '@/components/HeroCarousel'
import AboutTab from '@/components/AboutTab'
import TeachersTab from '@/components/TeachersTab'
import RoomsTab from '@/components/RoomsTab'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeTab, setActiveTab] = useState('about')

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutTab />
      case 'teachers':
        return <TeachersTab />
      case 'rooms':
        return <RoomsTab />
      default:
        return <AboutTab />
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="w-full mb-16">
            <HeroCarousel />
          </section>

          <section className="w-full">
            {renderContent()}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
