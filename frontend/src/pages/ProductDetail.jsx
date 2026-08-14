import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { fetchApi } from '../utils/api';
import { useCart } from '../context/CartContext';
import { Star, Heart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity, isLoggedIn, wishlistItems, addToWishlist, removeFromWishlist } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAddingWishlist, setIsAddingWishlist] = useState(false);
  
  useEffect(() => {
    // Scroll to top when navigating to a new product
    window.scrollTo(0, 0);
    
    const loadProductAndRelated = async () => {
      setLoading(true);
      try {
        const prodData = await fetchApi(`/api/products/${id}`);
        setProduct(prodData);
        
        // Load related products based on category
        if (prodData && prodData.category) {
          const relatedData = await fetchApi(`/api/products/category/${prodData.category}`);
          // Filter out the current product and grab up to 10 items (2 rows of 5)
          const filteredRelated = relatedData
            .filter(item => item.id !== prodData.id)
            .slice(0, 10);
          setRelatedProducts(filteredRelated);
        }
      } catch (error) {
        console.error("Failed to load product details", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductAndRelated();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '80vh' }}></div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '10rem 0', textAlign: 'center' }}>
          <h2>Product not found</h2>
          <Link to="/collections" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Collections</Link>
        </div>
      </>
    );
  }

  const {
    name = "Product Name",
    price = 0,
    originalPrice,
    image,
    imageUrl,
    description = "Premium quality streetwear designed for the modern era. Made with high-grade materials for maximum comfort and durability.",
    rating = 4.5,
    reviews = 120,
    brand = "STREVO",
    badge
  } = product;

  const displayImage = imageUrl || image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop";
  const wishlistItem = wishlistItems ? wishlistItems.find(item => item.product.id === id) : null;
  const isLiked = !!wishlistItem;

  const cartItem = cartItems.find(item => item.product.id === id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const cartItemId = cartItem ? cartItem.id : null;

  const formatPrice = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleUpdateQuantity = async (e, newQty) => {
    e.preventDefault();
    try {
      await updateQuantity(cartItemId, newQty);
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
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

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await addToCart(id, 1, selectedSize);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Please select a size before buying");
      return;
    }
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await addToCart(id, 1, selectedSize);
    navigate('/cart');
  };

  return (
    <>
      <Navbar />
      <div className="page-container page-padding">
        <Link to="/collections" className="back-link">
          <ArrowLeft size={16} /> Back to Collections
        </Link>
        
        <div className="product-detail-layout">
          {/* Left: Image */}
          <div className="product-detail-image-wrapper">
            {badge && <div className="detail-badge">{badge}</div>}
            <button 
              className={`detail-wishlist-btn ${isAddingWishlist ? 'btn-pop-animation' : ''}`} 
              onClick={handleWishlistToggle}
            >
              <Heart size={24} fill={isLiked ? "#ff2a2a" : "none"} color={isLiked ? "#ff2a2a" : "currentColor"} />
            </button>
            <img src={displayImage} alt={name} className="product-detail-image" />
          </div>

          {/* Right: Info */}
          <div className="product-detail-info">
            <p className="detail-brand">{brand}</p>
            <h1 className="detail-title">{name}</h1>
            
            <div className="detail-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={16} fill={i <= rating ? "#FFD700" : "none"} color={i <= rating ? "#FFD700" : "#e0e0e0"} />
                ))}
              </div>
              <span className="reviews-count">({reviews} reviews)</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-price">{formatPrice(price)}</span>
              {originalPrice && <span className="detail-original-price">{formatPrice(originalPrice)}</span>}
            </div>

            <div className="detail-description">
              <p>{description}</p>
            </div>

            <div className="detail-size-selector">
              <p className="size-title">Select Size</p>
              <div className="size-options">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size} 
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-actions">
              {cartQty > 0 ? (
                <div className="detail-qty-selector">
                  <button className="detail-qty-btn" onClick={(e) => handleUpdateQuantity(e, cartQty - 1)}>
                    <Minus size={20} />
                  </button>
                  <span className="detail-qty-value">{cartQty}</span>
                  <button className="detail-qty-btn" onClick={(e) => handleUpdateQuantity(e, cartQty + 1)}>
                    <Plus size={20} />
                  </button>
                </div>
              ) : (
                <button className="detail-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              )}
              <button className="detail-buy-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <div className="detail-perks">
              <div className="perk-item">
                <Truck size={20} />
                <span>Free shipping on orders over ₹1,999</span>
              </div>
              <div className="perk-item">
                <RotateCcw size={20} />
                <span>30-day easy returns</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={20} />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="section-title" style={{ marginTop: '5rem', marginBottom: '2rem' }}>You Might Also Like</h2>
            <div className="product-grid-5">
              {relatedProducts.map(relProduct => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
