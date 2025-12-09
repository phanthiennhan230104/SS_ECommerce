import React from "react";

const OrderStats = ({ orders }) => {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const shipping = orders.filter((o) => o.status === "shipping").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="order-stats">
      <div className="order-stat-card">
        <p className="order-stat-label">Tổng đơn</p>
        <p className="order-stat-value">{total}</p>
      </div>
      <div className="order-stat-card order-stat-card--pending">
        <p className="order-stat-label">Chờ xác nhận</p>
        <p className="order-stat-value">{pending}</p>
      </div>
      <div className="order-stat-card order-stat-card--confirmed">
        <p className="order-stat-label">Đã xác nhận</p>
        <p className="order-stat-value">{confirmed}</p>
      </div>
      <div className="order-stat-card order-stat-card--shipping">
        <p className="order-stat-label">Đang giao</p>
        <p className="order-stat-value">{shipping}</p>
      </div>
      <div className="order-stat-card order-stat-card--delivered">
        <p className="order-stat-label">Đã giao</p>
        <p className="order-stat-value">{delivered}</p>
      </div>
    </div>
  );
};

export default OrderStats;
