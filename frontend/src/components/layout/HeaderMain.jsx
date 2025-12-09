import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import authAPI from "../../api/authAPI";

const HeaderMain = () => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa (có token trong localStorage)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="header-main">
      <div className="container header-main__content">

        {/* LOGO */}
        <div className="header-logo" onClick={() => navigate("/home")}>
          <img src="/images/logo.png" alt="FlashMart" className="header-logo__image" />
        </div>

        {/* CATEGORY BUTTON */}
        <button className="header-category-btn" onClick={() => setShowCategories(!showCategories)}>
          ☰ Danh mục
        </button>

        {/* SEARCH BOX */}
        <div className="header-search">
          <input type="text" placeholder="Bạn muốn mua gì hôm nay?" className="header-search__input" />
          <button className="header-search__btn">Tìm kiếm</button>
        </div>

        {/* ACTIONS */}
        <div className="header-actions">

          <button
            className="header-actions__item"
            onClick={() => navigate("/orders")}
          >
            <span>📦</span>
            <span>Đơn hàng</span>
          </button>


          <button
            id="cart-icon"
            className="header-actions__item header-cart"
            onClick={() => navigate("/cart")}
          >
            <span className="header-cart__icon">🛒</span>
            <span>Giỏ hàng</span>
            <span className="header-cart__badge">2</span>
          </button>

          {isLoggedIn ? (
            <button 
              className="header-actions__item header-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button 
              className="header-actions__item header-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}

          <DarkModeToggle />
        </div>

      </div>

      {/* CATEGORY BAR */}
      {showCategories && (
        <nav className="header-catbar">
          <div className="container header-catbar__content">
            {[
              "Điện thoại", "Laptop", "Âm thanh", "PC - Màn hình", "Phụ kiện",
              "Smart Home", "Máy ảnh", "Khuyến mãi", "Tin công nghệ",
            ].map((cat) => (
              <button key={cat} className="header-catbar__item">
                {cat}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default HeaderMain;
