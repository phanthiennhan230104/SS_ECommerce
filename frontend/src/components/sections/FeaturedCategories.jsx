// src/components/sections/FeaturedCategories.jsx
import React from "react";
import { featuredCategories } from "../../utils/mockData";

const FeaturedCategories = () => {
  return (
    <section className="section section--light">
      <div className="container">
        <div className="section__header">
          <div className="section__title">
            <span className="section__icon">📌</span> Danh mục nổi bật
          </div>
        </div>

        <div className="category-grid">
          {featuredCategories.map((cat) => (
            <div
              className="category-card"
              key={cat.id}
              style={{ backgroundColor: cat.color }}
            >
              <div className="category-card__icon">{cat.icon}</div>
              <div className="category-card__label">{cat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
