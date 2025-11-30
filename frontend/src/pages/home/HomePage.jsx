// src/pages/home/HomePage.jsx
import React from "react";
import Header from "../../components/layout/Header";
import FlashSaleHero from "../../components/flashsale/FlashSaleHero";
import FlashSaleGrid from "../../components/flashsale/FlashSaleGrid";
import FeaturedCategories from "../../components/sections/FeaturedCategories";
import FeaturedProducts from "../../components/sections/FeaturedProducts";
import Footer from "../../components/layout/Footer";

const HomePage = () => {
  return (
    <div className="page">
      <Header />
      <main className="main">
        <FlashSaleHero />
        <FlashSaleGrid />
        <FeaturedCategories />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
