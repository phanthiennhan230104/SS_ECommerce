// src/components/sections/FeaturedProducts.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "../products/ProductCard";
import productAPI from "../../api/productAPI";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAllProducts();
        // Lọc sản phẩm không phải flash sale
        const regularProducts = response.data.filter(p => !p.flashSale);
        setProducts(regularProducts);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="section__header">
            <div className="section__title">
              <span className="section__icon">📈</span> Sản phẩm nổi bật
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <div className="section__title">
            <span className="section__icon">📈</span> Sản phẩm nổi bật
          </div>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
