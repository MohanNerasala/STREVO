import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { fetchApi } from '../utils/api';
import baggyImage from '../assets/baggy.avif';

const Collections = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const saleParam = searchParams.get('sale');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('Sort by: Featured');

  // Scroll to top on mount or route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/products';
        if (categoryParam) {
          endpoint = `/api/products/category/${categoryParam}`;
        }
        
        let data = await fetchApi(endpoint);
        
        // Basic frontend filtering for sale items if sale param is present
        // (In a real app, this should be a backend endpoint like /api/products/sale)
        if (saleParam) {
          data = data.filter(p => p.discountPercentage > 0);
        }
        
        setProducts(data);
      } catch (error) {
        console.error("Failed to load collection", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [categoryParam, saleParam]);

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
        <Link to="/collections" className={`tab-chip ${!categoryParam ? 'active' : ''}`}>All</Link>
        <Link to="/collections?category=New Drops" className={`tab-chip ${categoryParam === 'New Drops' ? 'active' : ''}`}>New Drops</Link>
        <Link to="/collections?category=Hoodies" className={`tab-chip ${categoryParam === 'Hoodies' ? 'active' : ''}`}>Hoodies</Link>
        <Link to="/collections?category=Tees" className={`tab-chip ${categoryParam === 'Tees' ? 'active' : ''}`}>Tees</Link>
        <Link to="/collections?category=Cargos" className={`tab-chip ${categoryParam === 'Cargos' ? 'active' : ''}`}>Cargos</Link>
        <Link to="/collections?category=Denim" className={`tab-chip ${categoryParam === 'Denim' ? 'active' : ''}`}>Denim</Link>
        <Link to="/collections?category=Sneakers" className={`tab-chip ${categoryParam === 'Sneakers' ? 'active' : ''}`}>Sneakers</Link>
        <Link to="/collections?category=Sale" className={`tab-chip tab-sale ${categoryParam === 'Sale' ? 'active' : ''}`}>Sale</Link>
      </div>

      <section className="section" style={{paddingTop: '2rem'}}>
        <div className="collection-header" style={{marginBottom: '2rem'}}>
          <p style={{fontWeight: 600}}>Showing {products.length} products for: {pageTitle}</p>
          <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>

        {loading ? (
          <div style={{ minHeight: '60vh' }}></div>
        ) : products.length === 0 ? (
          <div style={{padding: '5rem', textAlign: 'center'}}>No products found in this category.</div>
        ) : (
          <div className="product-grid-5">
            {[...products].sort((a, b) => {
              if (sortOption === 'Price: Low to High') return a.finalPrice - b.finalPrice;
              if (sortOption === 'Price: High to Low') return b.finalPrice - a.finalPrice;
              if (sortOption === 'Newest Arrivals') return new Date(b.createdAt) - new Date(a.createdAt);
              return 0; // Featured
            }).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Collections;
