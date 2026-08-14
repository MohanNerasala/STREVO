import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductSection from '../components/ProductSection';
import baggyImage from '../assets/baggy.avif';
import { fetchApi } from '../utils/api';

const TypewriterText = ({ text, delayOffset = 0 }) => {
  return (
    <span style={{ display: 'inline-block' }}>
      {text.split('').map((char, index) => (
        <span 
          key={index}
          className="typewriter-char"
          style={{
            animationDelay: `${delayOffset + index * 0.04}s`,
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const trendingData = await fetchApi('/api/products/category/Trending');
        setTrending(trendingData.slice(0, 5)); // Show max 5 items in the section
        
        const newData = await fetchApi('/api/products/category/New');
        setNewArrivals(newData.slice(0, 5));
        
        const bestData = await fetchApi('/api/products/category/BestSellers');
        setBestSellers(bestData.slice(0, 5));
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <style>{`
        .typewriter-char {
          display: inline-block;
          opacity: 0;
          animation: letterReveal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes letterReveal {
          0% { opacity: 0; transform: translateY(20px) rotate(5deg); }
          100% { opacity: 1; transform: translateY(0) rotate(0); }
        }
        .hero-subtitle {
          opacity: 0;
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 1.5s;
        }
        .hero-btns-animated {
          opacity: 0;
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 1.8s;
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <header className="hero">
        <div className="hero-content">
          <h1>
            <span style={{ display: 'block' }}><TypewriterText text="STREETWEAR BUILT" delayOffset={0.2} /></span>
            <span className="text-brand-red" style={{ display: 'block', marginTop: '0.1em' }}>
              <TypewriterText text="FOR THE NOW" delayOffset={0.2 + (16 * 0.04)} />
            </span>
          </h1>
          <p className="hero-subtitle">Best collection & limited drops.</p>
          <div className="hero-btns hero-btns-animated">
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
      
      {/* Trending Now */}
      {trending.length > 0 && (
        <ProductSection 
          title="Trending Now" 
          linkText="View All Trending" 
          linkTo="/collections?category=Trending" 
          products={trending} 
        />
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <ProductSection 
          title="New Arrivals" 
          linkText="Shop New Drops" 
          linkTo="/collections?category=New" 
          products={newArrivals} 
        />
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <ProductSection 
          title="Best Sellers" 
          linkText="View Top Rated" 
          linkTo="/collections?category=BestSellers" 
          products={bestSellers} 
        />
      )}
    </>
  );
};

export default Home;
