import React from 'react'
import Navbar from '../layout/Navbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import CodeEditorSection from "./Codesection";
import Workingsection from "./Workingsection";
import BanNotice from "../common/BanNotice";
// import VictoryResultScreen from '../battle/Results/VictoryPage';
// import LossPage from '../battle/Results/LossPage';



const Home = () => {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <BanNotice />
      </div>
    
      <HeroSection/>
      <FeaturesSection />
      <StatsSection/>
      <CodeEditorSection/>
      <Workingsection/>
      <CTASection />
      {/* <VictoryResultScreen />
      <LossPage/> */}
      
      

    
      {/* <BattleArena/> */}
      
      
    </div>
  )
}

export default Home
