import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, ChevronDown, Menu } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems, wishlistItems, isLoggedIn } = useCart();

  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">STRE<span>VO</span></Link>
      
      <div className="nav-center">
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/collections?category=New Drops">NEW DROPS</Link>
          
          <div className="nav-dropdown">
            <Link to="/collections" style={{ display: 'flex', alignItems: 'center' }}>
              COLLECTIONS <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </Link>
            <div className="dropdown-content">
              <Link to="/collections?category=New Drops">New Drops</Link>
              <Link to="/collections?category=Hoodies">Hoodies</Link>
              <Link to="/collections?category=Tees">Tees</Link>
              <Link to="/collections?category=Cargos">Cargos</Link>
              <Link to="/collections?category=Denim">Denim</Link>
              <Link to="/collections?category=Sneakers">Sneakers</Link>
              <Link to="/collections?category=Sale">Sale</Link>
            </div>
          </div>
          
          <Link to="/collections?category=Hoodies">HOODIES</Link>
          <Link to="/collections?category=Tees">TEES</Link>
          <Link to="/collections?category=Cargos">CARGOS</Link>
          <Link to="/collections?category=Denim">DENIM</Link>
          <Link to="/collections?category=Sneakers">SNEAKERS</Link>
          <Link to="/collections?category=Sale" className="sale-link">SALE</Link>
        </div>
      </div>
      
      <div className="nav-right">
        <div className="nav-search">
          <Search size={16} />
          <input type="text" placeholder="Search for products..." />
        </div>
        <div className="nav-icons">
          <Link to="/wishlist" title="Wishlist" style={{ position: 'relative' }}>
            <Heart size={20} />
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" title="Cart" style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" title="Profile">
              <User size={20} />
            </Link>
          ) : (
            <Link to="/login" className="nav-login" style={{borderRadius: 0}}>
              <User size={16} /> LOGIN
            </Link>
          )}
        </div>
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
