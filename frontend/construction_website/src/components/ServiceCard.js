import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../styles/ServiceCard.css';

const ServiceCard = ({ title, description, imageUrl, onBookNow }) => {
  return (
    <div className="service-card">
      <div className="image-container">
        <img
          src={imageUrl}
          alt={title}
          className="service-image"
        />
      </div>
      <div className="content-container">
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{description}</p>
        <button
          onClick={onBookNow}
          className="book-button"
        >
          Book Now
          <ArrowRight className="arrow-icon" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;