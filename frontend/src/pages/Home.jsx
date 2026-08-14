import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import baggyImage from '../assets/baggy.avif';

const Home = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>STREETWEAR BUILT<br/><span className="text-brand-red">FOR THE NOW</span></h1>
          <p>Best collection & limited drops.</p>
          <div className="hero-btns">
            <Link to="/collections?category=New" className="btn btn-primary">Shop New Drops</Link>
            <Link to="/collections" className="btn btn-outline">Explore Collections</Link>
          </div>
        </div>
      </header>
      
      {/* Categories Bento Box */}
      <section className="section">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem'}}>
            <h2 className="section-title" style={{marginBottom: 0, textAlign: 'left'}}>Curated Categories</h2>
            <Link to="/collections" style={{fontWeight: 600, borderBottom: '1px solid #000'}}>View All</Link>
        </div>
        
        <div className="home-bento-grid">
          
          <Link to="/collections?category=New" className="bento-item bento-wide">
            <div className="trending-badge" style={{background: 'black', color: 'white'}}>Dropping Now</div>
            <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" alt="New Drops" />
            <div className="bento-overlay" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)'}}>
              <h3 style={{fontSize: '2rem'}}>NEW DROPS</h3>
            </div>
          </Link>

          <Link to="/collections?category=Hoodies" className="bento-item bento-square">
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" alt="Hoodies" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>HOODIES</h3>
            </div>
          </Link>

          <Link to="/collections?category=Tees" className="bento-item bento-square">
            <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop" alt="Tees" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>TEES</h3>
            </div>
          </Link>

          <Link to="/collections?category=Cargos" className="bento-item bento-square">
            <img src={baggyImage} alt="Cargos" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>CARGOS</h3>
            </div>
          </Link>

          <Link to="/collections?category=Denim" className="bento-item bento-square">
            <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" alt="Denim" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>DENIM</h3>
            </div>
          </Link>

          <Link to="/collections?category=Sneakers" className="bento-item bento-wide">
            <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop" alt="Sneakers" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>SNEAKERS</h3>
            </div>
          </Link>

          <Link to="/collections?sale=true" className="bento-item bento-full">
            <div className="trending-badge" style={{background: '#ff2a2a', color: 'white'}}>Up to 50% Off</div>
            <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop" alt="Sale" />
            <div className="bento-overlay" style={{background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', justifyContent: 'center', padding: '4rem'}}>
              <h3 style={{fontSize: '4rem', color: '#ff2a2a'}}>ARCHIVE SALE</h3>
              <p style={{fontSize: '1.2rem'}}>Last chance to cop</p>
            </div>
          </Link>
          
        </div>
      </section>
      
      {/* New Arrivals Preview */}
      <section className="section" style={{ backgroundColor: '#f5f5f5' }}>
        <h2 className="section-title">Latest Drops</h2>
        <div className="product-grid">
          {/* Static placeholders for now, in a full app these would be fetched via API */}
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop" alt="Heavyweight Boxy Hoodie" className="product-image" />
            <div className="product-info">
              <div className="product-brand">STREVO</div>
              <h3 className="product-title">Heavyweight Boxy Hoodie</h3>
              <div className="product-price-row">
                <span className="final-price">₹2,499</span>
              </div>
              <button className="add-to-cart-btn">ADD TO CART</button>
            </div>
          </div>
          
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=600&auto=format&fit=crop" alt="Washed Oversized Graphic Tee" className="product-image" />
            <div className="product-info">
              <div className="product-brand">STREVO</div>
              <h3 className="product-title">Washed Oversized Graphic Tee</h3>
              <div className="product-price-row">
                <span className="final-price">₹1,299</span>
                <span className="original-price">₹1,799</span>
                <span className="discount-badge">-27%</span>
              </div>
              <button className="add-to-cart-btn">ADD TO CART</button>
            </div>
          </div>
          
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop" alt="Tactical Multi-Pocket Cargos" className="product-image" />
            <div className="product-info">
              <div className="product-brand">STREVO</div>
              <h3 className="product-title">Tactical Multi-Pocket Cargos</h3>
              <div className="product-price-row">
                <span className="final-price">₹2,899</span>
              </div>
              <button className="add-to-cart-btn">ADD TO CART</button>
            </div>
          </div>
          
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop" alt="Chunky Sole Sneakers" className="product-image" />
            <div className="product-info">
              <div className="product-brand">STREVO</div>
              <h3 className="product-title">Chunky Sole Sneakers</h3>
              <div className="product-price-row">
                <span className="final-price">₹4,999</span>
                <span className="original-price">₹5,999</span>
                <span className="discount-badge">-16%</span>
              </div>
              <button className="add-to-cart-btn">ADD TO CART</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
