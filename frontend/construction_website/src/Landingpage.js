import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Login from './components/Login';
import './styles/global.css';

function Landingpage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app">
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Contact />
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Landingpage;
