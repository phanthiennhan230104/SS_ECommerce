import React from "react";

const OrderStats = ({ orders }) => {
  const total = orders.length;
  const pending = orders.filter((o) => (o.status || "").toLowerCase() === "pending").length;
  const paid = orders.filter((o) => (o.status || "").toLowerCase() === "paid").length;
  const shipped = orders.filter((o) => (o.status || "").toLowerCase() === "shipped").length;
  const completed = orders.filter((o) => (o.status || "").toLowerCase() === "completed").length;

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
        <p className="label">Đã thanh toán</p>
        <p className="value">{paid}</p>
      </div>
      <div className="order-stat-box">
        <p className="label">Đang giao hàng</p>
        <p className="value">{shipped}</p>
      </div>
      <div className="order-stat-box">
        <p className="label">Hoàn thành</p>
        <p className="value">{completed}</p>
      </div>
    </div>
  );
};

export default OrderStats;
