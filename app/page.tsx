import { LandingHero } from '@/components/landing-hero'
import { LandingNavbar } from '@/components/landing-navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden">
      <LandingNavbar />
      <LandingHero />
    </div>
  )
}

