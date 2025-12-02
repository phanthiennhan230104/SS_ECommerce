import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Plus,
  Grid3x3,
  List,
  Filter,
} from "lucide-react";

// Card hiển thị 1 sản phẩm
function ProductCard({ name, price, stock, image, label, status }) {
  const getStatusText = () => {
    switch (status) {
      case "in-stock":
        return "Còn hàng";
      case "low-stock":
        return "Sắp hết";
      case "out-of-stock":
        return "Hết hàng";
      default:
        return "";
    }
  };

  const statusClass =
    status === "in-stock"
      ? "status-in-stock"
      : status === "low-stock"
      ? "status-low-stock"
      : "status-out-of-stock";

  return (
    <div className="product-card">
      <div className="product-card-media">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1585386959984-a4155223f3f8?w=800"
          }
          alt={name}
          className="product-card-img"
        />
        <span className={`product-status-pill ${statusClass}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="product-card-body">
        <p className="product-card-category">{label}</p>
        <p className="product-card-name">{name}</p>
        <p className="product-card-price">
          ₫{Number(price || 0).toLocaleString("vi-VN")}
        </p>
        <p className="product-card-stock">{stock} trong kho</p>

        <div className="product-card-footer">
          <button className="product-card-btn edit">Sửa</button>
          <button className="product-card-btn delete">🗑</button>
        </div>
      </div>
    </div>
  );
}

// map status DB -> status UI
function mapStatus(dbStatus, stock) {
  if (dbStatus === "OUT_OF_STOCK" || stock === 0) return "out-of-stock";
  if (stock !== null && stock !== undefined && stock < 10) return "low-stock";
  return "in-stock";
}

export function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: chỉnh baseURL nếu bạn dùng port khác
  const API_URL = "http://localhost:8081/api/admin/products";

  // gọi API lấy sản phẩm khi load trang
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Lỗi tải sản phẩm: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
        setError(e.message || "Không tải được danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // tính toán số liệu thống kê
  const { totalProducts, lowStockCount, totalValue } = useMemo(() => {
    const total = products.length;
    const low = products.filter(
      (p) => mapStatus(p.status, p.stock) === "low-stock"
    ).length;
    const value = products.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
      0
    );
    return { totalProducts: total, lowStockCount: low, totalValue: value };
  }, [products]);

  const bestSellers = 156; // demo

  // data demo cho mini chart
  const stockChart = [45, 52, 48, 61, 58, 65, 72];
  const lowStockChart = [15, 18, 22, 19, 23, 20, 23];
  const valueChart = [2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.8];
  const bestChart = [120, 135, 142, 138, 145, 152, 156];

  const maxStock = Math.max(...stockChart);
  const maxLow = Math.max(...lowStockChart);
  const maxValue = Math.max(...valueChart);
  const maxBest = Math.max(...bestChart);

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-page-wrapper">
      <div className="product-page">
        {/* HEADER */}
        <div className="product-header">
          <div>
            <h1 className="product-header-title">Quản lý Sản phẩm</h1>
            <p className="product-header-subtitle">
              Quản lý kho hàng và sản phẩm của bạn (dữ liệu từ database)
            </p>
          </div>

          {/* nút thêm – hiện tại chỉ là nút, bạn có thể gắn modal giống Flash Sale sau */}
          <button
            type="button"
            className="product-add-btn"
            onClick={() => alert("Sau này sẽ mở form thêm sản phẩm")}
          >
            <Plus /> Thêm sản phẩm
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="product-stats-grid">
          {/* Tổng sản phẩm */}
          <div className="product-stat-card">
            <div className="product-stat-header">
              <div>
                <p className="product-stat-title">Tổng sản phẩm</p>
                <p className="product-stat-value">{totalProducts}</p>
                <p className="product-stat-change positive">
                  +12% so với tháng trước
                </p>
              </div>
              <div className="product-stat-icon blue">
                <Package />
              </div>
            </div>
            <div className="product-stat-chart">
              {stockChart.map((v, i) => (
                <div
                  key={i}
                  className="product-stat-chart-bar blue"
                  style={{ height: `${(v / maxStock) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Sắp hết hàng */}
          <div className="product-stat-card">
            <div className="product-stat-header">
              <div>
                <p className="product-stat-title">Sắp hết hàng</p>
                <p className="product-stat-value">{lowStockCount}</p>
                <p className="product-stat-change negative">Cần nhập thêm</p>
              </div>
              <div className="product-stat-icon amber">
                <AlertTriangle />
              </div>
            </div>
            <div className="product-stat-chart">
              {lowStockChart.map((v, i) => (
                <div
                  key={i}
                  className="product-stat-chart-bar amber"
                  style={{ height: `${(v / maxLow) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Giá trị kho */}
          <div className="product-stat-card">
            <div className="product-stat-header">
              <div>
                <p className="product-stat-title">Giá trị kho</p>
                <p className="product-stat-value">
                  ₫{(totalValue / 1_000_000).toFixed(1)}M
                </p>
                <p className="product-stat-change positive">
                  +8% so với tháng trước
                </p>
              </div>
              <div className="product-stat-icon green">
                <DollarSign />
              </div>
            </div>
            <div className="product-stat-chart">
              {valueChart.map((v, i) => (
                <div
                  key={i}
                  className="product-stat-chart-bar green"
                  style={{ height: `${(v / maxValue) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Bán chạy (demo) */}
          <div className="product-stat-card">
            <div className="product-stat-header">
              <div>
                <p className="product-stat-title">Bán chạy</p>
                <p className="product-stat-value">{bestSellers}</p>
                <p className="product-stat-change positive">Tuần này</p>
              </div>
              <div className="product-stat-icon rose">
                <TrendingUp />
              </div>
            </div>
            <div className="product-stat-chart">
              {bestChart.map((v, i) => (
                <div
                  key={i}
                  className="product-stat-chart-bar rose"
                  style={{ height: `${(v / maxBest) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="product-toolbar">
          <button className="product-filter-btn">
            <Filter /> Bộ lọc
          </button>

          <div className="product-search-wrapper">
            <input
              className="product-search-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="product-view-toggle">
            <button
              className={`product-view-btn ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 />
            </button>
            <button
              className={`product-view-btn ${
                viewMode === "list" ? "active" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List />
            </button>
          </div>
        </div>

        {/* THÔNG BÁO LOADING / ERROR */}
        {loading && <p>Đang tải danh sách sản phẩm...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* GRID SẢN PHẨM */}
        {!loading && !error && viewMode === "grid" && (
          <div className="product-grid">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                price={p.price}
                stock={p.stock}
                image={p.imageUrl}
                label={`Mã SP #${p.id}`}
                status={mapStatus(p.status, p.stock)}
              />
            ))}
            {!filteredProducts.length && (
              <p>Không tìm thấy sản phẩm nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
