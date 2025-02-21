import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, DollarSign, Clock } from 'lucide-react';
import axios from 'axios';
import PaymentGateway from './PaymentGateway';
import BookingSuccess from './BookingSuccess';
import '../styles/AvailableProviders.css';

const AvailableProvidersContainer = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [bookingStep, setBookingStep] = useState('initial'); // initial, payment, success
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely access location state with fallback values
  const { serviceName = '', bookingDetails = {} } = location.state || {};

  useEffect(() => {
    if (!location.state || !serviceName || !bookingDetails) {
      navigate('/', { replace: true });
      return;
    }
    fetchWorkers();
  }, [serviceName, navigate, bookingDetails, location.state]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`http://127.0.0.1:8000/api/available-providers/`, {
        params: {
          service: serviceName,
          date: bookingDetails.date
        }
      });
      
      const filteredWorkers = response.data.filter(worker => 
        worker.skill && worker.skill.toLowerCase().trim() === serviceName.toLowerCase().trim()
      );
      
      setWorkers(filteredWorkers);
    } catch (error) {
      console.error('Error fetching workers:', error);
      setError('Failed to fetch service providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (worker) => {
    try {
      if (!worker || !worker.id) {
        throw new Error('Invalid worker data');
      }

      setSelectedWorker(worker);
      setBookingStep('payment');

      // Create initial booking record
      const bookingResponse = await axios.post('http://127.0.0.1:8000/api/bookings/', {
        customer_name: bookingDetails.name || '',
        customer_email: bookingDetails.email || '',
        service_type: serviceName,
        booking_date: bookingDetails.date || '',
        message: bookingDetails.message || '',
        worker: worker.id,
        status: 'PENDING'
      });

      setCurrentBookingId(bookingResponse.data.id);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
      setBookingStep('initial');
    }
  };

  const handlePaymentComplete = async () => {
    try {
      // Update booking status to confirmed after payment
      await axios.patch(`http://127.0.0.1:8000/api/bookings/${currentBookingId}/`, {
        status: 'CONFIRMED',
        payment_status: 'COMPLETED'
      });
      setBookingStep('success');
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Payment recorded but there was an error updating the booking. Please contact support.');
    }
  };

  const handlePaymentCancel = async () => {
    try {
      // Delete the pending booking if user cancels
      if (currentBookingId) {
        await axios.delete(`http://127.0.0.1:8000/api/bookings/${currentBookingId}/`);
      }
    } catch (error) {
      console.error('Error deleting pending booking:', error);
    }
    setBookingStep('initial');
    setCurrentBookingId(null);
    setSelectedWorker(null);
  };

  const handleSuccessComplete = () => {
    navigate('/bookings', { 
      state: { 
        bookingId: currentBookingId,
        workerName: selectedWorker.name,
        serviceName: serviceName
      }
    });
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 'payment':
        return (
          <div className="modal-overlay">
            <div className="modal-content">
              <PaymentGateway
                amount={selectedWorker.hourly_rate * 2} // 2 hours minimum
                onPaymentComplete={handlePaymentComplete}
                onClose={handlePaymentCancel}
              />
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="modal-overlay">
            <div className="modal-content">
              <BookingSuccess onAnimationComplete={handleSuccessComplete} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading available service providers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
      </div>
    );
  }

  return (
    <div className="available-providers">
      <div className="providers-header">
        <h2>Available Service Providers</h2>
        <p className="service-type">Service: {serviceName}</p>
        <p className="date-display">Date: {new Date(bookingDetails.date).toLocaleDateString()}</p>
      </div>
      
      <div className="providers-grid">
        {workers.length > 0 ? (
          workers.map((worker) => (
            <div key={worker.id} className="provider-card">
              <div className="provider-image">
                {worker.image ? (
                  <img 
                    src={`http://127.0.0.1:8000${worker.image}`} 
                    alt={worker.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-worker.png';
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    {worker.name ? worker.name[0].toUpperCase() : 'SP'}
                  </div>
                )}
              </div>
              <div className="provider-info">
                <h3>{worker.name || 'Unknown Provider'}</h3>
                <p className="provider-skill">{worker.skill}</p>
                <div className="provider-rating">
                  <Star className="star-icon" size={18} fill="#ffc107" />
                  <span>{(Number(worker.rating) || 0).toFixed(1)}</span>
                  <span className="total-ratings">({worker.total_ratings || 0} ratings)</span>
                </div>
                <div className="provider-experience">
                  <Clock className="experience-icon" size={18} />
                  <span>{worker.experience || 0} years experience</span>
                </div>
                <div className="provider-rate">
                  <DollarSign className="rate-icon" size={18} />
                  <span>${worker.hourly_rate || 0}/hour</span>
                </div>
                <button 
                  onClick={() => handleBooking(worker)}
                  className="book-button"
                  disabled={bookingStep !== 'initial'}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-providers">
            <p>No service providers available for the selected date and service.</p>
          </div>
        )}
      </div>

      {renderBookingStep()}
    </div>
  );
};

export default AvailableProvidersContainer;
