import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import baggyImage from '../assets/baggy.avif';

const Collections = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const saleParam = searchParams.get('sale');

  // Scroll to top on mount or route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // If a specific category or sale is selected, show Product Listing
  if (categoryParam || saleParam) {
    const pageTitle = saleParam ? 'SALE' : categoryParam.toUpperCase();
    
    return (
      <>
        <Navbar />
        <div className="collections-banner">
          <h2>{pageTitle}</h2>
          <p>Explore our exclusive curated drops</p>
        </div>
        
        <div className="collection-tabs">
          <Link to="/collections?category=New" className={`tab-chip ${categoryParam === 'New' ? 'active' : ''}`}>New Drops</Link>
          <Link to="/collections?category=Hoodies" className={`tab-chip ${categoryParam === 'Hoodies' ? 'active' : ''}`}>Hoodies</Link>
          <Link to="/collections?category=Tees" className={`tab-chip ${categoryParam === 'Tees' ? 'active' : ''}`}>Tees</Link>
          <Link to="/collections?category=Cargos" className={`tab-chip ${categoryParam === 'Cargos' ? 'active' : ''}`}>Cargos</Link>
          <Link to="/collections?category=Denim" className={`tab-chip ${categoryParam === 'Denim' ? 'active' : ''}`}>Denim</Link>
          <Link to="/collections?category=Sneakers" className={`tab-chip ${categoryParam === 'Sneakers' ? 'active' : ''}`}>Sneakers</Link>
          <Link to="/collections?sale=true" className={`tab-chip tab-sale ${saleParam ? 'active' : ''}`}>Sale</Link>
        </div>

        <section className="section" style={{paddingTop: '2rem'}}>
          <div className="collection-header" style={{marginBottom: '2rem'}}>
            <p style={{fontWeight: 600}}>Showing products for: {pageTitle}</p>
            <select className="sort-select">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          <div className="product-grid">
            {/* Dummy products for category view */}
            <div className="product-card">
              <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop" alt="Product" className="product-image" />
              <div className="product-info">
                <div className="product-brand">STREVO</div>
                <h3 className="product-title">Sample Product - {pageTitle}</h3>
                <div className="product-price-row">
                  <span className="final-price">₹2,499</span>
                </div>
                <button className="add-to-cart-btn">ADD TO CART</button>
              </div>
            </div>
             <div className="product-card">
              <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop" alt="Product" className="product-image" />
              <div className="product-info">
                <div className="product-brand">STREVO</div>
                <h3 className="product-title">Sample Product 2 - {pageTitle}</h3>
                <div className="product-price-row">
                  <span className="final-price">₹1,899</span>
                </div>
                <button className="add-to-cart-btn">ADD TO CART</button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Master Category Index (when just clicking "View All" or /collections)
  return (
    <>
      <Navbar />
      <section className="section" style={{paddingTop: '4rem'}}>
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h1 style={{fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px'}}>All Collections</h1>
          <p style={{fontSize: '1.1rem', color: '#666', marginTop: '1rem'}}>Explore all categories and latest drops.</p>
        </div>

        <div className="collections-master-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          
          <Link to="/collections?category=New" className="bento-item" style={{height: '400px'}}>
            <div className="trending-badge" style={{background: 'black', color: 'white'}}>Dropping Now</div>
            <img src="https://images.unsplash.com/photo-1523398002811-999aa8e9ddaa?q=80&w=800&auto=format&fit=crop" alt="New Drops" />
            <div className="bento-overlay" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)'}}>
              <h3 style={{fontSize: '2rem'}}>NEW DROPS</h3>
            </div>
          </Link>

          <Link to="/collections?category=Hoodies" className="bento-item" style={{height: '400px'}}>
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" alt="Hoodies" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>HOODIES</h3>
            </div>
          </Link>

          <Link to="/collections?category=Tees" className="bento-item" style={{height: '400px'}}>
            <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop" alt="Tees" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>TEES</h3>
            </div>
          </Link>

          <Link to="/collections?category=Cargos" className="bento-item" style={{height: '400px'}}>
            <img src={baggyImage} alt="Cargos" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>CARGOS</h3>
            </div>
          </Link>

          <Link to="/collections?category=Denim" className="bento-item" style={{height: '400px'}}>
            <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" alt="Denim" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>DENIM</h3>
            </div>
          </Link>

          <Link to="/collections?category=Sneakers" className="bento-item" style={{height: '400px'}}>
            <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop" alt="Sneakers" />
            <div className="bento-overlay">
              <h3 style={{fontSize: '2rem'}}>SNEAKERS</h3>
            </div>
          </Link>

          <Link to="/collections?sale=true" className="bento-item" style={{height: '400px', gridColumn: '1 / -1'}}>
            <div className="trending-badge" style={{background: '#ff2a2a', color: 'white'}}>Up to 50% Off</div>
            <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop" alt="Sale" />
            <div className="bento-overlay" style={{background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', justifyContent: 'center', padding: '4rem'}}>
              <h3 style={{fontSize: '4rem', color: '#ff2a2a'}}>ARCHIVE SALE</h3>
              <p style={{fontSize: '1.2rem'}}>Last chance to cop</p>
            </div>
          </Link>
          
        </div>
      </section>
    </>
  );
};

export default Collections;
