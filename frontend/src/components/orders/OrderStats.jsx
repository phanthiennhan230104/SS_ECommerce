import React from "react";

const OrderStats = ({ orders }) => {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const shipping = orders.filter((o) => o.status === "shipping").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="order-stats">
      <div className="order-stat-box">
        <p className="label">Tổng đơn hàng</p>
        <p className="value">{total}</p>
      </div>
      <div className="order-stat-box">
        <p className="label">Chờ xác nhận</p>
        <p className="value">{pending}</p>
      </div>
      <div className="order-stat-box">
        <p className="label">Đã xác nhận</p>
        <p className="value">{confirmed}</p>
      </div>
      <div className="order-stat-box">
        <p className="label">Đang giao hàng</p>
        <p className="value">{shipping}</p>
      </div>
      <div className="order-stat-box">
        <p className="label">Đã giao hàng</p>
        <p className="value">{delivered}</p>
      </div>
    </div>
  );
};

export default OrderStats;
