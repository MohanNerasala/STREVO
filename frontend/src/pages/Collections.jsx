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

  let pageTitle = "ALL COLLECTIONS";
  if (categoryParam) pageTitle = categoryParam.toUpperCase();
  if (saleParam) pageTitle = "SALE";
  
  return (
    <>
      <Navbar />
      <div className="collections-banner">
        <h2>{pageTitle}</h2>
        <p>Explore our exclusive curated drops</p>
      </div>
      
      <div className="collection-tabs">
        <Link to="/collections" className={`tab-chip ${!categoryParam && !saleParam ? 'active' : ''}`}>All</Link>
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
            <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop" alt="Product" className="product-image" />
            <div className="product-info">
              <div className="product-brand">STREVO</div>
              <h3 className="product-title">Tactical Multi-Pocket Cargos</h3>
              <div className="product-price-row">
                <span className="final-price">₹2,899</span>
              </div>
              <button className="add-to-cart-btn">ADD TO CART</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Collections;
