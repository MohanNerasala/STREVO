import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, loading, updateQuantity, updateSize, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = React.useState([]);
  const navigate = useNavigate();

  const handleToggleItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { items: selectedCartItems, subtotal } });
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const handleUpdateQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    
    if (newQty <= 0) {
      handleRemove(id);
      return;
    }

    try {
      await updateQuantity(id, newQty);
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const selectedCartItems = Array.isArray(cartItems) ? cartItems.filter(item => selectedItems.includes(item.id)) : [];
  
  const hasMissingSizes = selectedCartItems.some(item => !item.selectedSize);
  const isCheckoutDisabled = selectedCartItems.length === 0 || hasMissingSizes;

  const totalQuantity = selectedCartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  
  const subtotal = selectedCartItems.reduce((acc, item) => {
    return acc + ((item.product?.finalPrice || item.product?.price || 0) * (item.quantity || 1));
  }, 0);
  
  const taxAmount = selectedCartItems.length > 0 ? 10 : 0;
  const deliveryFee = selectedCartItems.length > 0 ? totalQuantity * 5 : 0;
  const total = subtotal + taxAmount + deliveryFee;

  const formatPrice = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <>
      <Navbar />
      <div className="page-container page-padding">
        <div className="cart-header">
          <h1 className="page-title">Your Cart</h1>
          <p className="cart-count-text">{cartItems.length} items</p>
        </div>

        {loading ? (
          <div style={{ minHeight: '50vh' }}></div>
        ) : cartItems.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={64} className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/collections?category=New Drops" className="btn btn-primary" style={{marginTop: '2rem'}}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item-card" style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ paddingRight: '15px' }}>
                    <input 
                      type="checkbox"
                      className="cart-custom-checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleToggleItem(item.id)}
                    />
                  </div>
                  <div className="cart-item-image-wrapper">
                    <Link to={`/product/${item.product.id}`}>
                      <img src={item.product.imageUrl || item.product.image} alt={item.product.name} style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                    </Link>
                  </div>
                  <div className="cart-item-details" style={{ flex: 1 }}>
                    <div className="cart-item-header">
                      <Link to={`/product/${item.product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
                          {item.product.name}
                        </h3>
                      </Link>
                      <button 
                        className="remove-btn" 
                        aria-label="Remove item"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="cart-item-meta" style={{ marginTop: '0.2rem' }}>Brand: {item.product.brand || 'Strevo'}</p>
                    
                    <div className="cart-item-bottom" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>Size:</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {['S', 'M', 'L', 'XL'].map(size => (
                            <button 
                              key={size} 
                              onClick={() => updateSize(item.id, size)}
                              className={`cart-item-size-btn ${item.selectedSize === size ? 'selected' : ''}`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="cart-premium-qty">
                        <button className="cart-premium-qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}>
                          <Minus size={14} />
                        </button>
                        <span className="cart-premium-qty-val">{item.quantity}</span>
                        <button className="cart-premium-qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      </div>
                      
                      <span className="cart-item-price" style={{ fontWeight: '800', fontSize: '1.2rem' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-section">
              <div className="summary-card">
                <h3 style={{ textTransform: 'uppercase', fontWeight: '800' }}>Order Summary</h3>
                
                {selectedCartItems.length > 0 ? (
                  <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                    {selectedCartItems.map(item => (
                      <div key={item.id} className="summary-row" style={{ fontSize: '0.9rem', color: '#333' }}>
                        <span style={{ maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.quantity}x {item.product?.name}
                        </span>
                        <span>{formatPrice((item.product?.finalPrice || item.product?.price || 0) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', marginTop: '1rem' }}>No items selected.</p>
                )}

                <div className="summary-divider"></div>

                <div className="summary-row" style={{ fontSize: '0.9rem', color: '#666' }}>
                  <span>Tax Amount</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="summary-row" style={{ fontSize: '0.9rem', color: '#666' }}>
                  <span>Delivery Charges (₹5/item)</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#000' }}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button 
                  className="checkout-btn" 
                  onClick={handleCheckout}
                  disabled={isCheckoutDisabled} 
                  style={{ opacity: isCheckoutDisabled ? 0.5 : 1, cursor: isCheckoutDisabled ? 'not-allowed' : 'pointer' }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                {hasMissingSizes && selectedCartItems.length > 0 && (
                  <p style={{ color: '#d9534f', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px' }}>
                    Please select a size for all checked items.
                  </p>
                )}
                <div className="secure-checkout-badge">
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
