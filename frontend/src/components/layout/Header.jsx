// src/components/layout/Header.jsx
import React from "react";
import HeaderTopBar from "./HeaderTopBar";
import HeaderMain from "./HeaderMain";

const Header = () => {
  return (
    <header className="header">
      <HeaderTopBar />
      <HeaderMain />
    </header>
  );
};

export default Header;
