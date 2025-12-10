import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import orderAPI from "../../api/orderAPI";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import OrderStats from "../../components/orders/OrderStats";
import OrderFilter from "../../components/orders/OrderFilter";
import OrderCard from "../../components/orders/OrderCard";

import "../../styles/order.css";

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vui lòng đăng nhập để xem đơn hàng!");
      navigate("/login");
      return;
    }

    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders", err);
      if (err.response?.status === 401) {
        alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (orderId) => {
    setExpandedOrders((prev) => {
      const ns = new Set(prev);
      if (ns.has(orderId)) ns.delete(orderId);
      else ns.add(orderId);
      return ns;
    });
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.orderCode.toLowerCase().includes(term) ||
      (o.customerName && o.customerName.toLowerCase().includes(term)) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <div className="orders-page">
          <div className="orders-container">

            {/* Header */}
            <div className="orders-header">
              <h1 className="orders-header-title">Đơn hàng của bạn</h1>
              <p className="orders-header-subtitle">
                Theo dõi trạng thái các đơn hàng
              </p>
            </div>

            {/* Stats */}
            <OrderStats orders={orders} />

            {/* Filters */}
            <OrderFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />

            {/* List */}
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <div className="orders-loading-spinner"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="orders-empty">
                <Package size={64} style={{ color: "#9ca3af", marginBottom: 16 }} />
                <p style={{ fontSize: 18 }}>Bạn chưa có đơn hàng nào</p>
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                  Hãy thêm sản phẩm vào giỏ hàng và đặt hàng để xem đơn hàng của bạn ở đây
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 16 }}>
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrders.has(order.id)}
                    onToggle={() => toggleExpanded(order.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderManagementPage;
