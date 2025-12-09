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
      <div className="order-filter-inner">
        <div className="order-filter-search">
          <span className="order-filter-search-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên hoặc email khách hàng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="order-filter-input"
          />
        </div>

        <div className="order-filter-select-wrapper">
          <span className="order-filter-select-icon">
            <Filter size={18} />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="order-filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;
