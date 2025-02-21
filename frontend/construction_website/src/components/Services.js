import React from 'react';
import { Building, Paintbrush, Wrench, Zap, Home, HardHat, Hammer, Ruler } from 'lucide-react'; // Replacing Tools with Hammer
import '../styles/Services.css';

const Services = () => {
  const services = [
    {
      icon: <Building size={32} />,
      title: 'Construction',
      description: 'Full-scale construction services for residential and commercial projects.'
    },
    {
      icon: <Paintbrush size={32} />,
      title: 'Painting',
      description: 'Professional painting services for interior and exterior spaces.'
    },
    {
      icon: <Wrench size={32} />,
      title: 'Plumbing',
      description: 'Complete plumbing solutions for installation and maintenance.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Electrical',
      description: 'Expert electrical services for all your power needs.'
    },
    {
      icon: <Home size={32} />,
      title: 'Home Services',
      description: 'Comprehensive home maintenance and repair services.'
    },
    {
      icon: <HardHat size={32} />,
      title: 'Renovation',
      description: 'Complete home and office renovation services.'
    },
    {
      icon: <Hammer size={32} />, // Replaced Tools with Hammer
      title: 'Maintenance',
      description: 'Regular maintenance services to keep your property in top condition.'
    },
    {
      icon: <Ruler size={32} />,
      title: 'Designing',
      description: 'Innovative and professional designing solutions for your spaces.'
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h1 className="services-title">Our Services</h1>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
