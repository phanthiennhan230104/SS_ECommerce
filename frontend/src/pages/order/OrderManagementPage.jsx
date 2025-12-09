import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import orderAPI from "../../api/orderAPI";

import OrderStats from "../../components/orders/OrderStats";
import OrderFilter from "../../components/orders/OrderFilter";
import OrderCard from "../../components/orders/OrderCard";

import "../../styles/order.css";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders", err);
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

  const handleChangeStatus = async (orderId, newStatus) => {
    const confirmText =
      newStatus === "confirmed"
        ? "Xác nhận đơn hàng này?"
        : newStatus === "shipping"
        ? "Chuyển đơn hàng sang trạng thái đang giao?"
        : "Xác nhận đã giao hàng thành công?";

    if (!window.confirm(confirmText)) return;

    try {
      setUpdatingId(orderId);
      await orderAPI.updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      console.error("Update status error", err);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setUpdatingId(null);
    }
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
    <div className="orders-page">
      <div className="orders-container">

        {/* Header */}
        <div className="orders-header">
          <h1 className="orders-header-title">Quản lý đơn hàng</h1>
          <p className="orders-header-subtitle">
            Theo dõi và xử lý đơn hàng của khách hàng
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
            <p style={{ fontSize: 18 }}>Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 16 }}>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedOrders.has(order.id)}
                onToggle={() => toggleExpanded(order.id)}
                onChangeStatus={handleChangeStatus}
                isUpdating={updatingId === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;
