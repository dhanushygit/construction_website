import React from "react";
import { Building2, Trophy, Users, Clock } from "lucide-react";
import "../styles/About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <h1 className="about-title">About BuildCo</h1>

        <div className="about-content">
          {/* Left Side - About Text */}
          <div className="about-text">
            <p className="about-highlight">Building Excellence Since 1990</p>
            <p className="about-description">
              With over three decades of experience in the construction industry,
              BuildCo has established itself as a leader in delivering exceptional
              construction services. Our commitment to quality, innovation, and
              customer satisfaction has earned us the trust of countless clients.
            </p>

            {/* Stats Grid */}
            <div className="stats-grid">
              <StatItem icon={<Building2 size={32} />} number="500+" label="Projects Completed" />
              <StatItem icon={<Trophy size={32} />} number="50+" label="Awards Won" />
              <StatItem icon={<Users size={32} />} number="1000+" label="Happy Clients" />
              <StatItem icon={<Clock size={32} />} number="30+" label="Years Experience" />
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"
              alt="Construction site"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable Stats Item Component
const StatItem = ({ icon, number, label }) => (
  <div className="stat-item">
    <div className="stat-icon">{icon}</div>
    <h3 className="stat-number">{number}</h3>
    <p className="stat-label">{label}</p>
  </div>
);

export default About;
