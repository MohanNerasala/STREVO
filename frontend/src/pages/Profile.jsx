import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error("Error parsing user data");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Full reload to update state globally
  };

  if (!user) return null; // Will redirect in useEffect

  const renderContent = () => {
    switch(activeTab) {
      case 'details':
        return (
          <div className="profile-section">
            <h2 className="profile-header">Account Details</h2>
            <div className="profile-stat-box">
              <div className="stat-row">
                <span className="stat-label">FULL NAME</span>
                <span className="stat-value">{user.fullName || 'STREVO Member'}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">EMAIL ADDRESS</span>
                <span className="stat-value">{user.email}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">MEMBER STATUS</span>
                <span className="stat-value" style={{color: '#ff2a2a', fontWeight: '900'}}>VIP LEVEL 1</span>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="profile-section">
            <h2 className="profile-header">Order History</h2>
            <div className="profile-stat-box" style={{textAlign: 'center', padding: '4rem 2rem'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase'}}>No Orders Yet</h3>
              <p style={{color: '#666', marginBottom: '2rem'}}>Your recent drops will appear here.</p>
              <button className="btn btn-primary" onClick={() => navigate('/collections')}>SHOP LATEST DROPS</button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="profile-section">
            <h2 className="profile-header">Preferences</h2>
            <div className="profile-stat-box">
              <div className="settings-toggle">
                <span className="stat-label">EMAIL NOTIFICATIONS (NEW DROPS)</span>
                <button className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>ENABLED</button>
              </div>
              <div className="settings-toggle" style={{marginTop: '2rem'}}>
                <span className="stat-label">SMS EARLY ACCESS</span>
                <button className="btn btn-outline" style={{padding: '0.5rem 1rem', color: '#000', borderColor: '#000'}}>DISABLED</button>
              </div>
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="profile-section">
            <h2 className="profile-header">Submit Feedback</h2>
            <div className="profile-stat-box">
              <p style={{marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px'}}>Help us build a better brand.</p>
              <textarea 
                className="brutalist-input" 
                rows="5" 
                placeholder="WHAT'S ON YOUR MIND?"
                style={{width: '100%', padding: '1rem', border: '1px solid #000', borderRadius: '0', resize: 'vertical', fontFamily: 'inherit'}}
              ></textarea>
              <button className="btn btn-primary" style={{marginTop: '1rem', width: '100%'}}>SUBMIT FEEDBACK</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <div className="profile-banner">
          <h1>MY DASHBOARD</h1>
        </div>
        <div className="profile-container">
          <div className="profile-sidebar">
            <button className={`profile-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
            <button className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
            <button className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
            <button className={`profile-tab ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>Feedback</button>
            <button className="profile-tab logout-tab" onClick={handleLogout}>Logout</button>
          </div>
          
          <div className="profile-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
