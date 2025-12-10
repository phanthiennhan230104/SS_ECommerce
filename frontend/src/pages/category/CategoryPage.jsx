import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/products/ProductCard";
import productAPI from "../../api/productAPI";

export default function CategoryPage() {
  const { category } = useParams(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productAPI
      .getByCategory(category)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, [category]);

  return (
    <div className="page">
      <Header />

      <main className="container" style={{ padding: "20px 0" }}>
        <h1 style={{ marginBottom: 20 }}>
          Danh mục: <span style={{ textTransform: "capitalize" }}>{category}</span>
        </h1>

        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
