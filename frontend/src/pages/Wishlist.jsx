import React from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlistItems = [], loading } = useCart();

  return (
    <>
      <Navbar />
      <div className="page-container page-padding">
        <div className="cart-header">
          <h1 className="page-title">Your Wishlist</h1>
          <p className="cart-count-text">{wishlistItems.length} items</p>
        </div>

        {loading ? (
          <div style={{ minHeight: '50vh' }}></div>
        ) : wishlistItems.length === 0 ? (
          <div className="empty-state">
            <Heart size={64} className="empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist to review them later.</p>
            <Link to="/collections" className="btn btn-primary" style={{marginTop: '2rem'}}>
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="product-grid-5">
            {wishlistItems.map(item => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
