import React from "react";
import { Search, Filter } from "lucide-react";

const OrderFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <div className="order-filter">
      <input
        type="text"
        placeholder="🔍 Tìm kiếm theo mã đơn, tên hoặc email khách hàng..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="pending">Chờ xác nhận</option>
        <option value="confirmed">Đã xác nhận</option>
        <option value="shipping">Đang giao hàng</option>
        <option value="delivered">Đã giao hàng</option>
        <option value="cancelled">Đã hủy</option>
      </select>
    </div>
  );
};

export default OrderFilter;
