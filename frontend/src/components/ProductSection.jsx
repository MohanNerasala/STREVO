import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

const ProductSection = ({ title, linkText = "View All", linkTo = "/collections", products = [] }) => {
  return (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title-premium">{title}</h2>
        <Link to={linkTo} className="view-all-link">
          {linkText} <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="product-grid-5">
        {products.map((product, index) => (
          <ProductCard key={product.id || index} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
