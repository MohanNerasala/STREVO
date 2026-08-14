import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchApi } from '../utils/api';
import { Package, CheckCircle, Clock, Truck, MapPin, XCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './ProfileOrder.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  
  const cancelReasons = [
    "Order placed by mistake",
    "Found a better price elsewhere",
    "Item no longer needed",
    "Delivery takes too long",
    "Change of mind"
  ];

  useEffect(() => {
    if (cancelModalOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cancelModalOpen]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await fetchApi('/api/orders');
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel || !cancelReason) return;
    try {
      // Optimistic update
      setOrders(orders.map(o => o.id === orderToCancel ? { ...o, status: 'CANCELLED', cancellationReason: cancelReason } : o));
      
      await fetchApi(`/api/orders/${orderToCancel}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason: cancelReason })
      });
      setCancelModalOpen(false);
      setOrderToCancel(null);
      setCancelReason('');
    } catch (e) {
      console.error("Failed to cancel order", e);
      alert("Failed to cancel order");
      fetchOrders(); // Revert
    }
  };

  const handleClearHistory = async (orderId) => {
    try {
      // Optimistic update
      setOrders(orders.filter(o => o.id !== orderId));
      await fetchApi(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error("Failed to delete order", e);
      alert("Failed to delete order");
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearAllHistory = async () => {
    if (!window.confirm("Are you sure you want to completely clear your order history?")) return;
    try {
      setOrders([]); // Optimistic update
      await fetchApi(`/api/orders/clear-history`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error("Failed to clear history", e);
      fetchOrders(); // Revert
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper page-fade-in" style={{ padding: '4rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>My Orders</h1>
          {orders.length > 0 && (
            <button 
              className="cancel-order-btn" 
              onClick={handleClearAllHistory}
              style={{ fontSize: '0.85rem' }}
            >
              CLEAR HISTORY
            </button>
          )}
        </div>
        
        {loadingOrders ? (
          <div style={{ minHeight: '50vh' }}></div>
        ) : orders.length === 0 ? (
          <div className="profile-stat-box" style={{textAlign: 'center', padding: '4rem 2rem', background: '#fff', border: '1px solid #eaeaea'}}>
            <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase'}}>No Orders Yet</h3>
            <p style={{color: '#666', marginBottom: '2rem'}}>Your recent drops will appear here.</p>
            <button className="btn btn-primary" onClick={() => navigate('/collections')}>SHOP LATEST DROPS</button>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {orders.map(order => (
              <div key={order.id} className="profile-stat-box order-card" style={{ background: '#fff', border: '1px solid #eaeaea' }}>
                <div className="order-header" onClick={() => toggleOrder(order.id)} style={{ cursor: 'pointer' }}>
                  <div>
                    <h4 style={{margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Package size={18} /> Order #{order.id.split('-')[0].toUpperCase()}
                    </h4>
                    <p style={{margin: 0, color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <Clock size={14} /> Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                      <p style={{margin: 0, fontWeight: '800', fontSize: '1.2rem'}}>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                      {expandedOrders[order.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                        {order.status === 'CANCELLED' ? <XCircle size={12}/> : <CheckCircle size={12}/>}
                        {order.status}
                      </span>
                      <button 
                        className="icon-btn" 
                        title="Clear History"
                        onClick={(e) => { e.stopPropagation(); handleClearHistory(order.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {order.status !== 'CANCELLED' && (
                  <div className="order-timeline-container">
                    <div className="order-timeline">
                      <div className={`timeline-step ${['ORDERED', 'SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon"><Package size={14}/></div>
                        <span className="step-text">Ordered</span>
                      </div>
                      <div className={`timeline-line ${['SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}></div>
                      <div className={`timeline-step ${['SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon"><Truck size={14}/></div>
                        <span className="step-text">Shipped</span>
                      </div>
                      <div className={`timeline-line ${['OUT FOR DELIVERY', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}></div>
                      <div className={`timeline-step ${['OUT FOR DELIVERY', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon"><MapPin size={14}/></div>
                        <span className="step-text">Out for Delivery</span>
                      </div>
                      <div className={`timeline-line ${['DELIVERED'].includes(order.status) ? 'active' : ''}`}></div>
                      <div className={`timeline-step ${['DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon"><CheckCircle size={14}/></div>
                        <span className="step-text">Delivered</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                      <div className="delivery-estimate">
                        <strong>Estimated Delivery:</strong> {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : 'Pending'}
                      </div>
                      
                      {['ORDERED', 'PENDING'].includes(order.status) && (
                        <button 
                          className="cancel-order-btn" 
                          onClick={() => { setOrderToCancel(order.id); setCancelModalOpen(true); }}
                        >
                          CANCEL ORDER
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {order.status === 'CANCELLED' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff5f5', borderRadius: '4px', border: '1px solid #ffebeb' }}>
                    <strong style={{ color: '#ff2a2a', display: 'block', marginBottom: '4px' }}>Order Cancelled</strong>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Reason: {order.cancellationReason || 'No reason provided'}</span>
                  </div>
                )}

                {expandedOrders[order.id] && (
                  <div className="order-expanded-details">
                    <div className="order-items-list">
                      <h5 style={{ textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Order Items</h5>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item-detail">
                          <img src={item.product?.imageUrl} alt={item.product?.name} className="order-item-image" />
                          <div className="order-item-info">
                            <h6 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem' }}>{item.product?.name}</h6>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Size: {item.size} | Qty: {item.quantity}</p>
                          </div>
                          <div className="order-item-price">
                            <span style={{ fontWeight: '700' }}>₹{((item.priceAtPurchase || 0) * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-cost-breakdown" style={{ marginTop: '2rem', padding: '1.5rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                      <h5 style={{ textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Cost Breakdown</h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                        <span>Items Subtotal</span>
                        <span>₹{((order.totalAmount || 0) - (order.taxAmount || 0) - (order.deliveryFee || 0)).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                        <span>Tax Amount</span>
                        <span>₹{(order.taxAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <span>Delivery Charges</span>
                        <span>₹{(order.deliveryFee || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem' }}>
                        <span>Total Paid</span>
                        <span>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div className="order-shipping-info">
                        <h5 style={{ textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginTop: '2rem' }}>Shipping Address</h5>
                        <div className="address-box-detail">
                          <p style={{ margin: '0 0 0.3rem 0', fontWeight: '700' }}>{order.shippingAddress.fullName}</p>
                          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            {order.shippingAddress.streetAddress}<br />
                            {order.shippingAddress.landmark && <>{order.shippingAddress.landmark}<br /></>}
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            Phone: {order.shippingAddress.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {cancelModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem', fontWeight: '800', textTransform: 'uppercase' }}>Cancel Order</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Please select a reason for cancellation:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {cancelReasons.map((reason, idx) => (
                <label key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  cursor: 'pointer',
                  padding: '0.8rem 1rem',
                  border: cancelReason === reason ? '2px solid #000' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: cancelReason === reason ? '#fafafa' : '#fff',
                  transition: 'all 0.2s'
                }}>
                  <input 
                    type="radio" 
                    name="cancelReason" 
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: cancelReason === reason ? '700' : '400' }}>{reason}</span>
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '0.8rem', flexDirection: 'column' }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.8rem', backgroundColor: '#ff2a2a', borderColor: '#ff2a2a', fontSize: '0.95rem' }}
                disabled={!cancelReason}
                onClick={handleCancelOrder}
              >
                CONFIRM CANCEL
              </button>
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.8rem', color: '#000', borderColor: '#000', fontSize: '0.95rem' }} 
                onClick={() => { setCancelModalOpen(false); setCancelReason(''); }}
              >
                GO BACK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
