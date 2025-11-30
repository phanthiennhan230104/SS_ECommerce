// src/components/layout/HeaderCategoryBar.jsx
import React from "react";

const categories = [
  "Điện thoại",
  "Laptop",
  "Âm thanh",
  "PC - Màn hình",
  "Phụ kiện",
  "Smart Home",
  "Máy ảnh",
  "Khuyến mãi",
  "Tin công nghệ",
];

const HeaderCategoryBar = () => {
  return (
    <nav className="header-catbar">
      <div className="container header-catbar__content">
        {categories.map((cat) => (
          <button key={cat} className="header-catbar__item">
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default HeaderCategoryBar;
