// src/components/sections/FeaturedProducts.jsx
import React from "react";
import { featuredProducts } from "../../utils/mockData";
import ProductCard from "../products/ProductCard";

const FeaturedProducts = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <div className="section__title">
            <span className="section__icon">📈</span> Sản phẩm nổi bật
          </div>
        </div>

        <div className="product-grid">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
