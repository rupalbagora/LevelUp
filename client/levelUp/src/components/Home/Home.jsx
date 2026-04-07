import React from 'react'
import Navbar from '../layout/Navbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import CodeEditorSection from "./codesection";
import Workingsection from "./Workingsection";
import VictoryResultScreen from '../battle/Results/VictoryPage';
import LossPage from '../battle/Results/LossPage';



const Home = () => {
  return (
    <div>
    
      <HeroSection/>
      <FeaturesSection />
      <StatsSection/>
      <CodeEditorSection/>
      <Workingsection/>
      <CTASection />
      <VictoryResultScreen />
      <LossPage/>
      
      

    
      {/* <BattleArena/> */}
      
      
    </div>
  )
}

export default Home
