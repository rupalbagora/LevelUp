import React from 'react'
import Navbar from '../layout/Navbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import CodeEditorSection from "./codesection";
import Workingsection from "./Workingsection";
import Footer from '../layout/Footer';
const Home = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <FeaturesSection />
      <StatsSection/>
      <CodeEditorSection/>
      <Workingsection/>
      <CTASection />
      <Footer />
      
      
      
    </div>
  )
}

export default Home
