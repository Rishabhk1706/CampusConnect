import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '../components/home/HeroSection'
import StatsSection from '../components/home/StatsSection'
import AboutSection from '../components/home/AboutSection'
import SeniorsSection from '../components/home/SeniorsSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import CategoriesSection from '../components/home/CategoriesSection'
import InterviewsSection from '../components/home/InterviewsSection'
import CommunitySection from '../components/home/CommunitySection'
import ChatPreviewSection from '../components/home/ChatPreviewSection'
import ResourcesSection from '../components/home/ResourcesSection'
import SuccessStoriesSection from '../components/home/SuccessStoriesSection'
import WhyChooseSection from '../components/home/WhyChooseSection'
import InnovationSection from '../components/home/InnovationSection'
import CtaSection from '../components/home/CtaSection'
import { scrollToSection } from '../utils/navigation'

export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const target = location.state?.scrollTo
    if (target) {
      requestAnimationFrame(() => scrollToSection(target))
    }
  }, [location.state])

  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <SeniorsSection />
      <HowItWorksSection />
      <CategoriesSection />
      <InterviewsSection />
      <CommunitySection />
      <ChatPreviewSection />
      <ResourcesSection />
      <SuccessStoriesSection />
      <WhyChooseSection />
      <InnovationSection />
      <CtaSection />
    </>
  )
}
