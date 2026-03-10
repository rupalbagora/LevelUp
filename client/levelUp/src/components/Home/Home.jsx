import React from 'react'
import Navbar from '../layout/Navbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import CodeEditorSection from "./codesection";
import Workingsection from "./Workingsection";
import Dashboard from '../Dashboard/Dashboard';
import BattleSetup from '../Dashboard/BattleSetup';
import Footer from '../layout/Footer';

const Home = () => {
  return (
    <div>
    
      <HeroSection/>
      <FeaturesSection />
      <StatsSection/>
      <CodeEditorSection/>
      <Workingsection/>
      <CTASection />
    
      
      
      
    </div>
  )
}

export default Home
