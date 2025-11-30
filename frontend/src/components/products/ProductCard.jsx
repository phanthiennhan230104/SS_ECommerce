// src/components/products/ProductCard.jsx
import React from "react";

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductCard = ({ product, flashSale = false }) => {
  const {
    name,
    price,
    originalPrice,
    soldPercent,
    image,
    tag,
  } = product;

  return (
    <div className={`product-card ${flashSale ? "product-card--flash" : ""}`}>
      {tag && <div className="product-card__tag">{tag}</div>}

      <div className="product-card__image">
        <span className="product-card__emoji">{image}</span>
      </div>

      <div className="product-card__body">
        <div className="product-card__name">{name}</div>

        <div className="product-card__price-group">
          <span className="product-card__price">{formatCurrency(price)}</span>
          {originalPrice && (
            <span className="product-card__price--old">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        {flashSale && (
          <div className="product-card__flash-meta">
            <span>Đã bán {soldPercent}%</span>
            <span>Còn lại ít</span>
          </div>
        )}

        {flashSale && (
          <div className="product-card__progress">
            <div
              className="product-card__progress-bar"
              style={{ width: `${soldPercent}%` }}
            ></div>
          </div>
        )}

        <button className="product-card__btn">
          {flashSale ? "Mua ngay" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
