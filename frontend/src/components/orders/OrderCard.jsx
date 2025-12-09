import React from "react";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderCard = ({
  order,
  isExpanded,
  onToggle,
  onChangeStatus,
  isUpdating,
}) => {
  const handleConfirm = () => onChangeStatus(order.id, "confirmed");
  const handleShipping = () => onChangeStatus(order.id, "shipping");
  const handleDelivered = () => onChangeStatus(order.id, "delivered");

  return (
    <div className="order-card">
      {/* Header */}
      <div className="order-card__header">
        <div className="order-card__header-top">
          <div style={{ display: "flex", gap: 12 }}>
            <div className="order-card__icon-box">
              <ShoppingCart size={20} color="#fff" />
            </div>
            <div className="order-card__meta">
              <span className="order-card__code">{order.orderCode}</span>
              <span className="order-card__date">{order.createdAt}</span>
            </div>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        <div className="order-card__header-main">
          <div>
            <p className="order-card__customer-label">Khách hàng</p>
            <p className="order-card__customer-name">
              {order.customerName || "Khách lẻ"}
            </p>
            <p className="order-card__customer-email">
              {order.customerEmail || ""}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p className="order-card__total-label">Tổng tiền</p>
            <p className="order-card__total-value">
              {order.totalAmount.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="order-card__body">
        <button type="button" className="order-card__toggle" onClick={onToggle}>
          <span>Chi tiết đơn hàng</span>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isExpanded && (
          <div className="order-card__details">
            {/* Địa chỉ */}
            <div className="order-card__address">
              <p className="order-card__section-title">Địa chỉ giao hàng</p>
              <p className="order-card__address-text">
                {order.customerAddress}
              </p>
            </div>

            {/* Sản phẩm */}
            <div>
              <p className="order-card__section-title">Sản phẩm</p>
              <div className="order-card__items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-card__item">
                    <div>
                      <p className="order-card__item-name">
                        {item.productName}
                      </p>
                      <p className="order-card__item-qty">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <p className="order-card__item-price">
                      {(
                        item.lineTotal ??
                        item.unitPrice * item.quantity
                      ).toLocaleString("vi-VN")}
                      đ
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="order-card__actions">
          {order.status === "pending" && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isUpdating}
              className="order-btn order-btn--primary"
            >
              <CheckCircle size={18} />
              {isUpdating ? "Đang xử lý..." : "Xác nhận đơn"}
            </button>
          )}

          {order.status === "confirmed" && (
            <button
              type="button"
              onClick={handleShipping}
              disabled={isUpdating}
              className="order-btn order-btn--purple"
            >
              <Truck size={18} />
              {isUpdating ? "Đang xử lý..." : "Bắt đầu giao hàng"}
            </button>
          )}

          {order.status === "shipping" && (
            <button
              type="button"
              onClick={handleDelivered}
              disabled={isUpdating}
              className="order-btn order-btn--green"
            >
              <Package size={18} />
              {isUpdating ? "Đang xử lý..." : "Xác nhận đã giao"}
            </button>
          )}

          {(order.status === "delivered" ||
            order.status === "cancelled") && (
            <div className="order-card__done">Đơn hàng đã hoàn thành</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
