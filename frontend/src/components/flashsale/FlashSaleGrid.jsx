// src/components/flashsale/FlashSaleGrid.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "../products/ProductCard";
import productAPI from "../../api/productAPI";

const FlashSaleGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        const response = await productAPI.getAllProducts();
        // Lọc sản phẩm flash sale
        const flashProducts = response.data.filter(p => p.flashSale);
        setProducts(flashProducts);
      } catch (error) {
        console.error("Lỗi khi tải flash sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  if (loading) {
    return (
      <section className="section section--flashsale">
        <div className="container">
          <div className="section__header">
            <div className="section__title">
              <span className="section__icon">⚡</span> Flash Sale
            </div>
            <button className="section__link">Xem tất cả &gt;</button>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--flashsale">
      <div className="container">
        <div className="section__header">
          <div className="section__title">
            <span className="section__icon">⚡</span> Flash Sale
          </div>
          <button className="section__link">Xem tất cả &gt;</button>
        </div>

        <div className="product-grid">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} flashSale />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleGrid;
