// src/components/layout/Header.jsx
import React from "react";
import HeaderTopBar from "./HeaderTopBar";
import HeaderMain from "./HeaderMain";
import HeaderCategoryBar from "./HeaderCategoryBar";

const Header = () => {
  return (
    <header className="header">
      <HeaderTopBar />
      <HeaderMain />
      <HeaderCategoryBar />
    </header>
  );
};

export default Header;
