// src/components/layout/HeaderMain.jsx
import React from "react";

const HeaderMain = () => {
  return (
    <div className="header-main">
      <div className="container header-main__content">
        {/* Logo */}
        <div className="header-logo">
          <span className="header-logo__icon">⚡</span>
          <span className="header-logo__text">FlashMart</span>
        </div>

        {/* Category button */}
        <button className="header-category-btn">
          <span className="header-category-btn__icon">☰</span>
          <span>Danh mục</span>
        </button>

        {/* Search */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Bạn muốn mua gì hôm nay?"
            className="header-search__input"
          />
          <button className="header-search__btn">Tìm kiếm</button>
        </div>

        {/* Actions */}
        <div className="header-actions">
          <button className="header-actions__item">
            <span role="img" aria-label="order">
              📦
            </span>
            <span>Đơn hàng</span>
          </button>

          <button className="header-actions__item header-cart">
            <span className="header-cart__icon" role="img" aria-label="cart">
              🛒
            </span>
            <span>Giỏ hàng</span>
            <span className="header-cart__badge">2</span>
          </button>

          <button className="header-actions__item header-login">
            <span role="img" aria-label="user">
              👤
            </span>
            <span>Đăng nhập</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMain;
