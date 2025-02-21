import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaCalendarAlt} from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('workers');
  const [selectedService, setSelectedService] = useState('all');
  const [newWorker, setNewWorker] = useState({
    name: '',
    skill: '',
    experience: '',
    phone: '',
    email: '',
    image: null,
    bio: '',
    hourly_rate: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const services = [
    'All Services',
    'Home Renovation',
    'Plumbing Services',
    'Painting & Decoration',
    'Custom Cabinetry and Carpentry',
    'Flooring Installation',
    'Moving Services',
    'Demolition Services',
    'Excavation',
    'Architectural Design',
    'Handyman Services',
    'Gardening and Lawn Care',
    'Pool Maintenance',
    'Home Organization',
    'Electrical Repairs',
    'Interior Designs',
    'House Cleaning'
  ];

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      setIsLoggedIn(false);
      return;
    }
    
    setIsLoggedIn(true);
    fetchWorkers();
    fetchBookings();
  }, [navigate]);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/workers/');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings/');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleWorkerInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker(prev => ({
      ...prev,
      [name]: name === 'experience' || name === 'hourly_rate' 
        ? parseFloat(value) || '' 
        : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = '';
        return;
      }

      setNewWorker(prev => ({
        ...prev,
        image: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'skill', 'experience', 'phone', 'email', 'hourly_rate'];
    const missingFields = requiredFields.filter(field => !newWorker[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const formData = new FormData();
      
      // Add all fields to formData
      Object.keys(newWorker).forEach(key => {
        if (newWorker[key] !== null && newWorker[key] !== undefined && newWorker[key] !== '') {
          if (key === 'image' && newWorker[key] instanceof File) {
            formData.append('image', newWorker[key]);
          } else if (key === 'experience') {
            formData.append(key, parseInt(newWorker[key], 10));
          } else if (key === 'hourly_rate') {
            formData.append(key, parseFloat(newWorker[key]));
          } else {
            formData.append(key, newWorker[key]);
          }
        }
      });

      // Add default values
      formData.append('rating', '5.00');
      formData.append('total_ratings', '0');
      formData.append('availability', 'true');
      
      console.log('Submitting worker data:', Object.fromEntries(formData));

      const response = await axios.post('http://127.0.0.1:8000/api/workers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response.data);

      if (response.data && response.data.worker) {
        alert('Worker added successfully!');
        // Update workers list with the new worker
        setWorkers(prevWorkers => [...prevWorkers, response.data.worker]);
        // Reset form
        setNewWorker({
          name: '',
          skill: '',
          experience: '',
          phone: '',
          email: '',
          image: null,
          bio: '',
          hourly_rate: '',
        });
        setPreviewImage(null);
        
        // Refresh the workers list
        fetchWorkers();
      }
    } catch (error) {
      console.error('Error adding worker:', error.response?.data || error.message);
      let errorMessage = 'An error occurred while adding the worker';
      
      if (error.response?.data) {
        if (typeof error.response.data.error === 'object') {
          errorMessage = Object.entries(error.response.data.error)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('\n');
        } else {
          errorMessage = error.response.data.error || errorMessage;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/admin/login/', {
        username: username,
        password: password
      });

      if (response.data.status === 'success') {
        setIsLoggedIn(true);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('username', response.data.user.username);
        fetchWorkers();
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/workers/${workerId}/`);
        setWorkers(workers.filter(worker => worker.id !== workerId));
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/bookings/${bookingId}/`);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        status: action === 'accept' ? 'ACCEPTED' : 'REJECTED'
      });

      // Update the bookings list with the new status
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? response.data : booking
      ));

      // Send email notification if booking is accepted
      if (action === 'accept') {
        try {
          await axios.post(`http://127.0.0.1:8000/api/send-booking-email/`, {
            booking_id: bookingId,
            status: 'ACCEPTED'
          });
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Don't block the booking process if email fails
        }
      }

      // Show success message
      alert(`Booking ${action === 'accept' ? 'accepted' : 'declined'} successfully`);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const filteredWorkers = selectedService === 'all' 
    ? workers 
    : workers.filter(worker => worker.skill === selectedService);

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="login-form">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-nav">
        <button 
          className={`nav-button ${activeTab === 'workers' ? 'active' : ''}`}
          onClick={() => setActiveTab('workers')}
        >
          <FaUserTie /> Workers
        </button>
        <button 
          className={`nav-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <FaCalendarAlt /> Bookings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'workers' && (
          <>
            <section className="add-worker-section">
              <h2>Add New Worker</h2>
              <form onSubmit={handleAddWorker} className="add-worker-form">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={newWorker.name}
                    onChange={handleWorkerInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Service Type:</label>
                  <select
                    name="skill"
                    value={newWorker.skill}
                    onChange={handleWorkerInputChange}
                    required
                  >
                    <option value="">Select a service</option>
                    {services.filter(service => service !== 'All Services').map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience (years):</label>
                  <input
                    type="number"
                    name="experience"
                    value={newWorker.experience}
                    onChange={handleWorkerInputChange}
                    min="0"
                    step="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newWorker.phone}
                    onChange={handleWorkerInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={newWorker.email}
                    onChange={handleWorkerInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hourly Rate (rs):</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={newWorker.hourly_rate}
                    onChange={handleWorkerInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bio:</label>
                  <textarea
                    name="bio"
                    value={newWorker.bio}
                    onChange={handleWorkerInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Profile Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Preview" />
                    </div>
                  )}
                </div>
                <button type="submit" className="submit-button">Add Worker</button>
              </form>
            </section>

            <section className="workers-list-section">
              <div className="section-header">
                <h2>Workers List</h2>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="service-filter"
                >
                  {services.map(service => (
                    <option key={service} value={service === 'All Services' ? 'all' : service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="workers-grid">
                {filteredWorkers.map((worker) => (
                  <div key={worker.id} className="worker-card">
                    <div className="worker-image">
                      {worker.image ? (
                        <img src={worker.image} alt={worker.name} />
                      ) : (
                        <FaUserTie className="default-worker-image" />
                      )}
                    </div>
                    <div className="worker-info">
                      <h3>{worker.name}</h3>
                      <p><strong>Skill:</strong> {worker.skill}</p>
                      <p><strong>Experience:</strong> {worker.experience} years</p>
                      <p><strong>Phone:</strong> {worker.phone}</p>
                      <p><strong>Email:</strong> {worker.email}</p>
                      <p><strong>Rate:</strong> ${worker.hourly_rate}/hr</p>
                      {worker.bio && <p><strong>Bio:</strong> {worker.bio}</p>}
                      <div className="worker-rating">
                        <span><strong>Rating:</strong> {worker.rating}</span>
                        <span>({worker.total_ratings} reviews)</span>
                      </div>
                      <button
                        className="delete-worker-btn"
                        onClick={() => handleDeleteWorker(worker.id)}
                        style={{ backgroundColor: 'red', color: 'white' }}
                      >
                        Delete Worker
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'bookings' && (
          <section className="bookings-section">
            <h2>Recent Bookings</h2>
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Worker Assigned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.customer_name}</td>
                      <td>{booking.service_type}</td>
                      <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>{booking.worker ? booking.worker.name : 'Not assigned'}</td>
                      <td>
                        <div className="booking-actions">
                          {booking.status === 'PENDING' && (
                            <>
                              <button 
                                className="action-button accept"
                                onClick={() => handleBookingAction(booking.id, 'accept')}
                              >
                                Accept
                              </button>
                              <button 
                                className="action-button decline"
                                onClick={() => handleBookingAction(booking.id, 'decline')}
                              >
                                Decline
                              </button>
                            </>
                          )}
                          <button 
                            className="action-button delete" 
                            onClick={() => handleDeleteBooking(booking.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
