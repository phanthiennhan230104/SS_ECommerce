// src/components/products/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import cartAPI from "../../api/cartAPI";

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

/**
 * Fly-to-cart animation
 */
const flyToCart = (imgEl) => {
  if (!imgEl) return;

  const cartIcon = document.querySelector("#cart-icon");
  if (!cartIcon) return;

  const imgRect = imgEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const flyImg = document.createElement("img");
  flyImg.src = imgEl.src;
  flyImg.className = "fly-img";
  flyImg.style.left = `${imgRect.left}px`;
  flyImg.style.top = `${imgRect.top}px`;

  document.body.appendChild(flyImg);

  requestAnimationFrame(() => {
    const translateX = cartRect.left - imgRect.left;
    const translateY = cartRect.top - imgRect.top;

    flyImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.1)`;
    flyImg.style.opacity = "0";
  });

  setTimeout(() => {
    flyImg.remove();
  }, 900);
};

const ProductCard = ({ product, flashSale = false, onAddToCart }) => {
  const { name, price, originalPrice, soldPercent, image, tag } = product;

  const imgRef = React.useRef(null);

  const handleClick = () => {
    if (imgRef.current) {
      flyToCart(imgRef.current);
    }

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // tạm thời log cho demo
      console.log("Added to cart:", product.name);
    }
  };

  const isDiscounted =
    typeof originalPrice === "number" && originalPrice > price;

  return (
    <div className={`product-card ${flashSale ? "product-card--flash" : ""}`}>
      <div className="product-card__image-wrap">
        {tag && <div className="product-card__tag">{tag}</div>}

        {flashSale && (
          <div className="product-card__flash-badge">
            ⚡ FLASH SALE
          </div>
        )}

        <img
          ref={imgRef}
          src={image}
          alt={name}
          className="product-card__image"
        />
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{name}</h3>

        <div className="product-card__price-row">
          <div className="product-card__price">
            <span className="product-card__price-current">
              {formatCurrency(price)}
            </span>
            {isDiscounted && (
              <span className="product-card__price-original">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {typeof soldPercent === "number" && (
          <div className="product-card__sold">
            <div className="product-card__sold-bar">
              <div
                className="product-card__sold-bar-fill"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
            <span className="product-card__sold-label">
              Đã bán {soldPercent}%
            </span>
          </div>
        )}

        <button className="product-card__btn" onClick={handleClick}>
          {flashSale ? "Mua ngay" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
