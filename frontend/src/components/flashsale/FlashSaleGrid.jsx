// src/components/flashsale/FlashSaleGrid.jsx
import React from "react";
import { flashSaleProducts } from "../../utils/mockData";
import ProductCard from "../products/ProductCard";

const FlashSaleGrid = () => {
  return (
    <section className="section section--flashsale">
      <div className="container">
        <div className="section__header">
          <div className="section__title">
            <span className="section__icon">⚡</span> Flash Sale
          </div>
          <button className="section__link">Xem tất cả &gt;</button>
        </div>

        <div className="product-grid">
          {flashSaleProducts.map((item) => (
            <ProductCard key={item.id} product={item} flashSale />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleGrid;
