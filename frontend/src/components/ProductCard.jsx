import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, isLoggedIn, wishlistItems, addToWishlist, removeFromWishlist } = useCart();
  const [isAddingWishlist, setIsAddingWishlist] = useState(false);
  // Destructure with default fallbacks
  const {
    id = 1,
    name = "Product Name",
    price = 999,
    originalPrice,
    image = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop",
    rating = 4.5,
    reviews = 120,
    badge
  } = product;

  // Determine cart state from context
  const cartItem = cartItems.find(item => item.product.id === id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const cartItemId = cartItem ? cartItem.id : null;

  // Determine wishlist state from context
  const wishlistItem = wishlistItems ? wishlistItems.find(item => item.product.id === id) : null;
  const isLiked = !!wishlistItem;

  // Format price in Indian Rupee
  const formatPrice = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} fill="#FFD700" color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        // Simple half star logic: just show an outlined star for now or we could do a half-filled SVG
        stars.push(<Star key={i} size={14} fill="url(#half)" color="#FFD700" />); // This needs an SVG def, fallback to outline
      } else {
        stars.push(<Star key={i} size={14} color="#e0e0e0" />);
      }
    }
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(id, 1, null);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleUpdateQuantity = async (e, newQty) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateQuantity(cartItemId, newQty);
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setIsAddingWishlist(true);
    try {
      if (isLiked) {
        await removeFromWishlist(wishlistItem.id);
      } else {
        await addToWishlist(id);
      }
      setTimeout(() => setIsAddingWishlist(false), 300);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      setIsAddingWishlist(false);
    }
  };

  return (
    <div className="premium-product-card">
      <Link to={`/product/${id}`} className="card-image-link">
        <div className="card-image-container">
          {badge && <div className="card-badge">{badge}</div>}
          <button 
            className={`card-wishlist-btn ${isAddingWishlist ? 'btn-pop-animation' : ''}`} 
            onClick={handleWishlistToggle}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isLiked ? "#ff2a2a" : "none"} color={isLiked ? "#ff2a2a" : "currentColor"} />
          </button>
          <img src={image} alt={name} className="card-image" loading="lazy" />
        </div>
      </Link>
      
      <div className="card-info">
        <div className="card-rating">
          <div className="stars">{renderStars()}</div>
          <span className="reviews-count">({reviews})</span>
        </div>
        
        <Link to={`/product/${id}`} className="card-title-link">
          <h3 className="card-title" title={name}>{name}</h3>
        </Link>
        
        <div className="card-bottom">
          <div className="card-price-container">
            <span className="current-price">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="original-price">{formatPrice(originalPrice)}</span>
            )}
          </div>
        </div>
        
        {cartQty > 0 ? (
          <div className="inline-qty-selector">
            <button className="qty-btn" onClick={(e) => handleUpdateQuantity(e, cartQty - 1)}>
              <Minus size={16} />
            </button>
            <span className="qty-value">{cartQty}</span>
            <button className="qty-btn" onClick={(e) => handleUpdateQuantity(e, cartQty + 1)}>
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button 
            className="always-visible-cart-btn" 
            onClick={(e) => {
              if (navigator.vibrate) navigator.vibrate(50);
              const target = e.currentTarget;
              target.classList.add('btn-pop-animation');
              setTimeout(() => {
                if (target) target.classList.remove('btn-pop-animation');
              }, 300);
              handleAddToCart(e);
            }}
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
