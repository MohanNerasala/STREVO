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
          <p>Oversized fits, cargo layers, clean silhouettes, and limited men's drops.</p>
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
        
        <div className="category-bento">
          <Link to="/collections?category=Hoodies" className="bento-item bento-large">
            <div className="trending-badge">🔥 Most Popular</div>
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" alt="Hoodies" />
            <div className="bento-overlay">
              <h3>Heavyweight Hoodies</h3>
              <p>Shop the staple</p>
            </div>
          </Link>
          
          <Link to="/collections?category=Tees" className="bento-item bento-medium">
            <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop" alt="Graphic Tees" />
            <div className="bento-overlay">
              <h3>Graphic Tees</h3>
              <p>Just Dropped</p>
            </div>
          </Link>
          
          <Link to="/collections?category=Cargos" className="bento-item bento-small">
            <img src={baggyImage} alt="Cargo Pants" />
            <div className="bento-overlay">
              <h3>Cargos</h3>
              <p>Utility fits</p>
            </div>
          </Link>

          <Link to="/collections?category=Sneakers" className="bento-item bento-small">
            <div className="trending-badge" style={{background: '#ff2a2a', color: 'white'}}>⚡ Trending</div>
            <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop" alt="Sneakers" />
            <div className="bento-overlay">
              <h3>Sneakers</h3>
              <p>Hype footwear</p>
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
