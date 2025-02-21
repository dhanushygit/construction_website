import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookingModal.css';

const BookingModal = ({ isOpen, onClose, service }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFindProviders = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.date) {
        throw new Error('Please fill in all required fields');
      }

      // Normalize the service type to match the worker skills
      const normalizedServiceType = service.title.toLowerCase().trim();

      navigate('/available-providers', {
        state: {
          serviceName: normalizedServiceType,
          bookingDetails: {
            ...formData,
            service: normalizedServiceType,
            serviceId: service.id
          }
        }
      });
    } catch (error) {
      setError(error.message || 'Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">
          <X className="close-icon" />
        </button>

        <div className="booking-header">
          <h2>Book {service.title}</h2>
          <p className="service-description">{service.description}</p>
        </div>

        <form onSubmit={handleFindProviders} className="booking-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              required
            />
          </div>

          <div className="form-group">
            <label>Preferred Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Any specific requirements..."
              rows="2"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Finding Providers...' : 'Find Available Providers'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;