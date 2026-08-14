import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Wallet, Truck, CheckCircle, Star } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const state = location.state || {};
  const items = state.items || [];
  const subtotal = state.subtotal || 0;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', street: '', landmark: '', city: '', state: '', postalCode: '', country: 'India', isDefault: true
  });

  const [paymentMethod, setPaymentMethod] = useState(''); // 'UPI', 'COD', 'CARD'
  const [upiOption, setUpiOption] = useState(''); // 'PhonePe', 'GPay', 'Paytm'
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (showSuccessModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSuccessModal]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    loadAddresses();
  }, [items, navigate]);

  const loadAddresses = async () => {
    try {
      const data = await fetchApi('/api/addresses');
      setSavedAddresses(data);
      const defaultAddr = data.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      } else {
        setIsAddingNewAddress(true);
      }
    } catch (e) {
      console.error("Failed to load addresses", e);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const saved = await fetchApi('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(newAddress)
      });
      setSavedAddresses([...savedAddresses, saved]);
      setSelectedAddressId(saved.id);
      setIsAddingNewAddress(false);
    } catch (error) {
      console.error("Failed to save address", error);
      alert("Failed to save address. Check fields.");
    }
  };

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = 10;
  const delivery = totalQty * 5;
  const total = subtotal + tax + delivery;

  const isOrderReady = selectedAddressId && paymentMethod && (paymentMethod !== 'UPI' || upiOption);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      let finalPaymentMethod = paymentMethod;
      if (paymentMethod === 'UPI') finalPaymentMethod = `UPI - ${upiOption}`;
      
      const response = await fetchApi('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          cartItemIds: items.map(i => i.id),
          addressId: selectedAddressId,
          paymentMethod: finalPaymentMethod
        })
      });
      if (response && response.id) {
        setPlacedOrderId(response.id);
        setShowSuccessModal(true);
        setIsPlacingOrder(false);
        fetchCart(); // Clear cart state
      }
    } catch (error) {
      console.error("Failed to place order", error);
      alert("This order has already been processed or your cart is empty. Redirecting to your orders...");
      navigate('/orders');
      setIsPlacingOrder(false);
    }
  };

  const handleRating = async (val) => {
    setRating(val);
    try {
      await fetchApi(`/api/orders/${placedOrderId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating: val })
      });
      setFeedbackSubmitted(true);
    } catch (e) {
      console.error("Failed to submit feedback", e);
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout-page page-fade-in">
        <h1 className="checkout-header">Checkout</h1>
        
        <div className="checkout-container">
          {/* LEFT COLUMN */}
          <div className="checkout-left">
            
            {/* ADDRESS SECTION */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={20} /> Shipping Address</span>
              </div>
              
              {!isAddingNewAddress && savedAddresses.length > 0 && (
                <div className="address-list">
                  {savedAddresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      {selectedAddressId === addr.id && <CheckCircle size={18} color="#000" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }} />}
                      <div className="address-card-name">{addr.fullName}</div>
                      <div className="address-card-details">
                        {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}<br />
                        {addr.state}, {addr.postalCode}, {addr.country}<br />
                        Phone: {addr.phone}
                      </div>
                    </div>
                  ))}
                  <div 
                    className="address-card add-new-address-card" 
                    onClick={() => setIsAddingNewAddress(true)}
                  >
                    + Add New Address
                  </div>
                </div>
              )}

              {isAddingNewAddress && (
                <form className="address-form" onSubmit={handleSaveAddress}>
                  <div>
                    <label>Full Name</label>
                    <input required value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                  </div>
                  <div className="address-form-full">
                    <label>Street Address</label>
                    <input required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                  </div>
                  <div className="address-form-full">
                    <label>Landmark (Optional)</label>
                    <input value={newAddress.landmark} onChange={e => setNewAddress({...newAddress, landmark: e.target.value})} />
                  </div>
                  <div>
                    <label>City</label>
                    <input required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                  </div>
                  <div>
                    <label>State</label>
                    <input required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                  </div>
                  <div>
                    <label>Pincode / Postal Code</label>
                    <input required value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} />
                  </div>
                  <div className="address-form-full" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      id="isDefault" 
                      checked={newAddress.isDefault} 
                      onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} 
                      style={{ width: 'auto' }}
                    />
                    <label htmlFor="isDefault" style={{ marginBottom: 0, textTransform: 'none', fontSize: '0.9rem', cursor: 'pointer' }}>
                      Set as my default shipping address
                    </label>
                  </div>
                  <div className="address-form-full" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn save-address-btn" style={{ flex: 1 }}>SAVE ADDRESS</button>
                    {savedAddresses.length > 0 && (
                      <button type="button" className="btn btn-outline" style={{ flex: 1, borderColor: '#000', color: '#000' }} onClick={() => setIsAddingNewAddress(false)}>CANCEL</button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* PAYMENT SECTION */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Wallet size={20} /> Payment Method</span>
              </div>
              
              <div className="payment-methods-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className={`payment-method ${paymentMethod === 'UPI' ? 'selected' : ''}`} onClick={() => setPaymentMethod('UPI')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>UPI</span>
                  {paymentMethod === 'UPI' && <CheckCircle size={16} color="#000" />}
                </div>

                <div className={`payment-method ${paymentMethod === 'CARD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('CARD')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><CreditCard size={16} /> Card</span>
                  {paymentMethod === 'CARD' && <CheckCircle size={16} color="#000" />}
                </div>

                <div className={`payment-method ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Truck size={16} /> COD</span>
                  {paymentMethod === 'COD' && <CheckCircle size={16} color="#000" />}
                </div>
              </div>

              <div className="payment-forms-container">
                {paymentMethod === 'UPI' && (
                  <div className="payment-sub-options" style={{ borderTop: 'none', paddingTop: '0', marginTop: '0' }}>
                    {['PhonePe', 'GPay', 'Paytm'].map(opt => (
                      <div 
                        key={opt}
                        className={`sub-option ${upiOption === opt ? 'selected' : ''}`}
                        onClick={() => setUpiOption(opt)}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="card-form" style={{ borderTop: 'none', paddingTop: '0', marginTop: '0' }}>
                    <div className="address-form-full">
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CARD NUMBER</label>
                      <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>EXPIRY (MM/YY)</label>
                      <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>CVV</label>
                      <input type="text" placeholder="123" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* RIGHT COLUMN */}
          <div className="checkout-right">
            <div className="checkout-summary">
              <div className="checkout-summary-card">
                <h3>Order Summary</h3>
                {items.length > 0 ? (
                <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                  {items.map(item => (
                    <div key={item.id} className="summary-row" style={{ fontSize: '0.9rem', color: '#333' }}>
                      <span style={{ maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.quantity}x {item.product?.name}
                      </span>
                      <span>₹{((item.product?.finalPrice || item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="summary-row">
                  <span>Selected Items</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="summary-divider" style={{ borderTop: '1px solid #eee', margin: '1rem 0' }}></div>
              
              <div className="summary-row" style={{ fontSize: '0.9rem', color: '#666' }}>
                <span>Tax Amount</span>
                <span>₹10</span>
              </div>
              <div className="summary-row" style={{ fontSize: '0.9rem', color: '#666' }}>
                <span>Delivery Charges (₹5/item)</span>
                <span>₹{delivery.toLocaleString('en-IN')}</span>
              </div>
                
                <div className="summary-total">
                  <span>TOTAL</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>

                <button 
                  className="place-order-btn" 
                  disabled={!isOrderReady || isPlacingOrder}
                  onClick={handlePlaceOrder}
                >
                  {isPlacingOrder ? 'PROCESSING...' : 'PROCEED TO ORDER'}
                </button>
                {!isOrderReady && (
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#ff2a2a', marginTop: '1rem', fontWeight: '600' }}>
                    Select an address and payment method to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal-content">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle size={60} color="#000" />
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', textTransform: 'uppercase', fontWeight: '800' }}>Order Successful!</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Thank you for shopping with us.</p>
            
            {!feedbackSubmitted ? (
              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 1rem 0', fontWeight: '700', fontSize: '0.9rem' }}>HOW WAS YOUR EXPERIENCE?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={30} 
                      onClick={() => handleRating(star)}
                      fill={rating >= star ? '#000' : 'none'}
                      color={rating >= star ? '#000' : '#ccc'}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontWeight: '700', color: '#000' }}>Thank you for your feedback!</p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <button className="btn btn-primary" onClick={() => navigate('/orders')} style={{ padding: '1rem' }}>
                VIEW ORDER
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/')} style={{ padding: '1rem', color: '#000', borderColor: '#000' }}>
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
