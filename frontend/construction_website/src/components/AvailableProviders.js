import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, DollarSign, Clock } from 'lucide-react';
import axios from 'axios';
import PaymentModal from './PaymentModal';
import '../styles/AvailableProviders.css';

const AvailableProvidersContainer = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
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
      
      // Fetch workers filtered by service type and date
      const response = await axios.get(`http://127.0.0.1:8000/api/available-providers/`, {
        params: {
          service: serviceName,
          date: bookingDetails.date
        }
      });
      
      // Additional client-side filtering to ensure exact service type match
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

      // Create the booking
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
      setSelectedWorker(worker);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handlePaymentComplete = async () => {
    try {
      // Update booking status to indicate payment completed
      await axios.patch(`http://127.0.0.1:8000/api/bookings/${currentBookingId}/`, {
        payment_status: 'COMPLETED'
      });

      // Navigate to booking status page
      navigate('/booking-status', { 
        state: { 
          bookingId: currentBookingId,
          workerName: selectedWorker.name,
          serviceName: serviceName
        }
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Payment recorded but there was an error updating the booking. Please contact support.');
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

  if (!serviceName || !bookingDetails) {
    return (
      <div className="error-container">
        <div className="error">Invalid booking request. Please start over.</div>
        <button onClick={() => navigate('/')} className="back-button">Go to Home</button>
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
                  className="book-button"
                  onClick={() => handleBooking(worker)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-providers">
            <p>No service providers available for the selected date and service.</p>
            <button onClick={() => navigate(-1)} className="back-button">
              Go Back
            </button>
          </div>
        )}
      </div>

      {showPayment && selectedWorker && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
          amount={selectedWorker.hourly_rate || 0}
          workerName={selectedWorker.name}
          serviceName={serviceName}
        />
      )}
    </div>
  );
};

export default AvailableProvidersContainer;
