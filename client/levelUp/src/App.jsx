import React from 'react'
import Navbar from './components/layout/Navbar';
import Home from './components/Home/Home';
import {Routes,Route} from "react-router-dom"
import Auth from './components/auth/Auth';



const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth/signin' element={<Auth/>}/>
    
      </Routes>
    </div>
  );
}

export default App
