import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, ChevronDown, Menu } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // In a real app, you would fetch cart count and user state from Context/Redux
  const cartCount = 0;
  const isLoggedIn = false;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">STRE<span>VO</span></Link>
      
      <div className="nav-center">
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/collections?category=New">NEW DROPS</Link>
          
          <div className="nav-dropdown">
            <Link to="/collections" style={{ display: 'flex', alignItems: 'center' }}>
              COLLECTIONS <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </Link>
            <div className="dropdown-content">
              <Link to="/collections?category=Hoodies">Oversized Hoodies</Link>
              <Link to="/collections?category=Tees">Graphic Tees</Link>
              <Link to="/collections?category=Cargos">Cargo Pants</Link>
              <Link to="/collections?category=Denim">Baggy Denim</Link>
              <Link to="/collections?category=Jackets">Varsity Jackets</Link>
              <Link to="/collections?category=Sets">Co-ord Sets</Link>
              <Link to="/collections?category=Techwear">Techwear</Link>
              <Link to="/collections?category=Skatewear">Skatewear</Link>
            </div>
          </div>
          
          <Link to="/collections?category=Hoodies">HOODIES</Link>
          <Link to="/collections?category=Tees">TEES</Link>
          <Link to="/collections?category=Cargos">CARGOS</Link>
          <Link to="/collections?category=Denim">DENIM</Link>
          <Link to="/collections?category=Sneakers">SNEAKERS</Link>
          <Link to="/collections?sale=true" className="sale-link">SALE</Link>
        </div>
      </div>
      
      <div className="nav-right">
        <div className="nav-search">
          <Search size={16} />
          <input type="text" placeholder="Search for products..." />
        </div>
        <div className="nav-icons">
          <Link to="#" title="Wishlist"><Heart size={20} /></Link>
          <Link to="/cart" title="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <Link to="/login" className="nav-login">
            <User size={16} /> {isLoggedIn ? 'Account' : 'Login'}
          </Link>
        </div>
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
