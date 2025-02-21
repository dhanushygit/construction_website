import React from 'react';
import '../styles/Hero.css';
function Hero() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero bg-gray-900 text-white h-screen flex items-center justify-center text-center">
      <div className="hero-content">
        <h1 className="text-5xl font-bold fade-in">Building Your Dreams,<br />One Brick at a Time</h1>
        <p className="text-lg mt-4 fade-in">Excellence in construction since 1990</p>
        <button onClick={scrollToServices} className="book">
          Book now
        </button>
      </div>
    </section>
  );
}

export default Hero;
