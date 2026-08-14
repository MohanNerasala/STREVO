import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { fetchApi } from '../utils/api';
import { User as UserIcon, Edit2, Package, CheckCircle, Clock, Truck, XCircle, Trash2 } from 'lucide-react';

import './ProfileOrder.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [user, setUser] = useState(null);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { logout } = useCart();

  useEffect(() => {
    const loadUserData = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setEditName(parsed.fullName || '');
        setEditAvatar(parsed.avatarUrl || '');
      } catch (e) {
        console.error("Error parsing user data");
      }
    };
    loadUserData();
  }, [navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setEditName(parsed.fullName || '');
        setEditAvatar(parsed.avatarUrl || '');
      } catch (e) {
        console.error("Error parsing user data");
      }
    };
    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await fetchApi('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: editName,
          avatarUrl: editAvatar
        })
      });
      // Update local storage and state
      const newUserObj = { ...user, fullName: updatedUser.fullName, avatarUrl: updatedUser.avatarUrl };
      localStorage.setItem('user', JSON.stringify(newUserObj));
      setUser(newUserObj);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null; // Will redirect in useEffect

  const renderContent = () => {
    switch(activeTab) {
      case 'details':
        return (
          <div className="profile-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 className="profile-header" style={{margin: 0}}>Account Details</h2>
              {!isEditing && (
                <button className="btn btn-outline" style={{padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px'}} onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} /> Edit Profile
                </button>
              )}
            </div>

            <div className="profile-stat-box">
              {isEditing ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem'}}>FULL NAME</label>
                    <input 
                      type="text" 
                      className="brutalist-input" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      style={{width: '100%', padding: '1rem'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem'}}>AVATAR IMAGE URL</label>
                    <input 
                      type="text" 
                      className="brutalist-input" 
                      value={editAvatar} 
                      placeholder="https://example.com/my-photo.jpg"
                      onChange={(e) => setEditAvatar(e.target.value)}
                      style={{width: '100%', padding: '1rem'}}
                    />
                  </div>
                  <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <button className="btn btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                    <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="stat-row">
                    <span className="stat-label">FULL NAME</span>
                    <span className="stat-value">{user.fullName || 'STREVO Member'}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">EMAIL ADDRESS</span>
                    <span className="stat-value">{user.email}</span>
                  </div>
                  <div className="stat-row" style={{borderBottom: 'none'}}>
                    <span className="stat-label">MEMBER STATUS</span>
                    <span className="stat-value" style={{color: '#ff2a2a', fontWeight: '900'}}>VIP LEVEL 1</span>
                  </div>
                </>
              )}
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
              <button className="btn btn-primary" style={{marginTop: '1rem', width: '100%'}} onClick={() => alert('Feedback submitted! Thank you.')}>SUBMIT FEEDBACK</button>
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
        <div className="profile-container">
          
          <div className="profile-header-section" style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem', paddingBottom: '2rem'}}>
            <div style={{
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '2px solid #e0e0e0'
            }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <UserIcon size={50} color="#999" />
              )}
            </div>
            <div>
              <h1 style={{fontSize: '2.5rem', fontWeight: '900', margin: '0 0 0.5rem 0', textTransform: 'uppercase'}}>{user.fullName || 'My Profile'}</h1>
              <p style={{color: '#666', margin: 0, fontSize: '1.1rem'}}>{user.email}</p>
            </div>
          </div>

          <div className="profile-sidebar">
            <button className={`profile-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
            <button className="profile-tab" onClick={() => navigate('/orders')}>Orders</button>
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
