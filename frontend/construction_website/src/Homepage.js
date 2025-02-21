import React, { useState, useEffect, useRef } from 'react';
import { Wrench, Home, Paintbrush as Paint, Ruler, Truck, Hammer, Search, User, Briefcase, Shovel, PenTool, Flower2, Waves, FolderCheck, Zap, Palette, Trash2 } from 'lucide-react';
import ServiceCard from './components/ServiceCard';
import BookingModal from './components/BookingModal';
import './Homepage.css';
import { LogOut } from "lucide-react";
import {useNavigate } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'Home Renovation',
    description: 'Complete home makeover services including kitchen, bathroom, and living spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
    icon: Home,
  },
  {
    id: 2,
    title: 'Plumbing Services',
    description: 'Expert plumbing solutions for repairs, installations, and maintenance.',
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=1200',
    icon: Wrench,
  },
  {
    id: 3,
    title: 'Painting & Decoration',
    description: 'Professional painting services for both interior and exterior spaces.',
    imageUrl: 'https://media.istockphoto.com/id/1278237817/photo/woman-coloring-interiors-of-her-workshop.webp?a=1&b=1&s=612x612&w=0&k=20&c=jVYw09EbDelL_bsyK8t04L51O_6Uh6L1qtNVKZjG8pA=',
    icon: Paint,
  },
  {
    id: 4,
    title: 'Custom Cabinetry and Carpentry',
    description: 'Specialized custom cabinetry and expert carpentry solutions for your unique needs.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664302183129-7fdd3b472123?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fENhcnBlbnRyeXxlbnwwfHwwfHx8MA%3D%3D',
    icon: Briefcase,
  },
  {
    id: 5,
    title: 'Flooring Installation',
    description: 'Expert installation of hardwood, tile, laminate, and vinyl flooring.',
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200',
    icon: Ruler,
  },
  {
    id: 6,
    title: 'Moving Services',
    description: 'Professional moving services for homes and offices with care and precision.',
    imageUrl: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=1200',
    icon: Truck,
  },
  {
    id: 7,
    title: 'Demolition Services',
    description: 'Professional and safe demolition services for residential and commercial projects.',
    imageUrl: 'https://images.unsplash.com/photo-1594155840350-fac3cc4b6816?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RGVtb2xpdGlvbiUyMFNlcnZpY2VzfGVufDB8fDB8fHww',
    icon: Hammer,
  },
  {
    id: 8,
    title: 'Excavation',
    description: 'Precise excavation services for construction projects and site preparation.',
    imageUrl: 'https://images.unsplash.com/photo-1614977645540-7abd88ba8e56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
    icon: Shovel,
  },
  {
    id: 9,
    title: 'Architectural Design',
    description: 'Professional architectural design services for your construction and renovation projects.',
    imageUrl: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?auto=format&fit=crop&q=80&w=1200',
    icon: PenTool,
  },
  {
    id: 10,
    title: 'Handyman Services',
    description: 'Professional handyman services for various home repairs and maintenance tasks.',
    imageUrl: 'https://media.istockphoto.com/id/1485176078/photo/handyman.webp?a=1&b=1&s=612x612&w=0&k=20&c=5b-dI4S4Uv7lBck_32VJX2IgMRqsqkAV7lcRp4kgva4=',
    icon: PenTool,
  },
  {
    id: 11,
    title: 'Gardening and Lawn Care',
    description: 'Expert gardening and lawn maintenance services for a beautiful outdoor space.',
    imageUrl: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&q=80&w=1200',
    icon: Flower2,
  },
  {
    id: 12,
    title: 'Pool Maintenance',
    description: 'Professional pool cleaning, maintenance, and repair services.',
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200',
    icon: Waves,
  },
  {
    id: 13,
    title: 'Home Organization',
    description: 'Professional organizing solutions for every room in your home.',
    imageUrl: 'https://media.istockphoto.com/id/1425889021/photo/woman-put-wicker-box-with-cosmetics-products-in-bathroom-closet.webp?a=1&b=1&s=612x612&w=0&k=20&c=kslVOMq0_RTe-_dU4-heN4H3AoslUoHNlJpDOYlEVFo=',
    icon: FolderCheck,
  },
  {
    id: 14,
    title: 'Electrical Repairs',
    description: 'Expert electrical repair and installation services for your home.',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
    icon: Zap,
  },
  {
    id: 15,
    title: 'Interior Design',
    description: 'Professional interior design services to transform your living spaces.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    icon: Palette,
  },
  {
    id: 16,
    title: 'House Cleaning',
    description: 'Professional house cleaning services for a spotless and healthy home.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1200',
    icon: Trash2,
  },// Services array as before
];

function Homepage() {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  
  // Get the username from localStorage
  const username = localStorage.getItem('username') || 'Guest'; 

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const handleSearchResultClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightSearchQuery = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <span key={i} className="search-highlight">{part}</span> : part
    );
  };
  const navigate=useNavigate()
  function handlesignout(){
    navigate('/')
  }
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="search-container" ref={searchRef}>
              <div className="search-input-container">
                <div className="search-icon">
                  <Search className="search-icon-svg" />
                </div>
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && filteredServices.length > 0 && (
                  <div className="search-results-dropdown">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        className="search-result-item"
                        onClick={() => handleSearchResultClick(service)}
                      >
                        <div className="search-result-content">
                          <div className="search-result-image">
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="search-result-img"
                            />
                          </div>
                          <div className="search-result-text">
                            <p className="search-result-title">
                              {highlightSearchQuery(service.title)}
                            </p>
                            <p className="search-result-description">
                              {highlightSearchQuery(service.description)}
                            </p>
                          </div>
                          <button className="search-result-button">
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="user-profile-container">
              <button
                onClick={() => setShowUserDetails(!showUserDetails)}
                className="user-profile-button"
              >
                <div className="user-avatar">
                  <User className="user-avatar-icon" />
                </div>
                <div className="user-info">
                  <p className="user-name">{username}</p> {/* Display the username */}
                  <p className="user-role">Premium Member</p>
                </div>
              </button>

              {/* User Details Dropdown */}
              {showUserDetails && (
                <div className="modal-overlay" onClick={() => setShowUserDetails(false)}>
                  <div className="user-details-dropdown">
                    <div className="user-details-header">
                      <h3 className="user-details-name">{username}</h3>
                      <p className="user-details-role">Premium Member</p>
                      <button className='signout' onClick={handlesignout} >Sign out <LogOut size={20} /></button>

                    </div>
                    <div className="user-details-content">
                      {/* Display user details */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000"
            alt="Construction background"
            className="hero-image"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Your Space with <br />
              <span className="hero-highlight">Professional Expertise</span>
            </h1>
            <p className="hero-description">
              From renovation to repair, our expert team delivers exceptional quality and reliability for all your construction and home service needs.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section">
        <div className="services-header">
          <h2 className="services-title">
            Our Professional Services
          </h2>
          <p className="services-description">
            Comprehensive solutions for all your construction and home improvement needs
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              onBookNow={() => handleBookNow(service)}
            />
          ))}
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
}

export default Homepage;
