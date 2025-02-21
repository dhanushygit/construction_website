import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import '../styles/Contact.css'; // Custom CSS for the contact page

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="contact-section" id='contact'>
      <div className="container">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-content">
          {/* Left Side - Contact Info */}
          <div className="contact-info">
            <h3 className="sub-title">Get in Touch</h3>
            <p className="contact-description">
              We're here to help with all your construction needs. Reach out to us today!
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <Phone size={24} className="icon phone-icon" />
                <div>
                  <h4 className="contact-label">Phone</h4>
                  <a href="tel:+1234567890" className="contact-text">+91 6300688894</a>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={24} className="icon email-icon" />
                <div>
                  <h4 className="contact-label">Email</h4>
                  <a href="mailto:info@hcservices.com" className="contact-text">hcsservices.com@gmail.com</a>
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={24} className="icon address-icon" />
                <div>
                  <h4 className="contact-label">Address</h4>
                  <address className="contact-text">SWARNANDHRA COLLEGE NARSAPUR</address>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Message Form */}
          <div className="contact-form">
            <h3 className="sub-title">Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="form-input" rows="5"></textarea>
              </div>
              <button type="submit" className="submit-btn">
                <Send size={16} className="submit-icon" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
