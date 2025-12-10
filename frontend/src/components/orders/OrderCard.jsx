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
import orderAPI from "../../api/orderAPI"; // ✅ THÊM DÒNG NÀY

const OrderCard = ({
  order,
  isExpanded,
  onToggle,
  onReload, // ✅ nếu bạn muốn reload list sau khi update, truyền từ cha (optional)
}) => {
  // ✅ Đảm bảo status luôn lowercase để so sánh
  const status = (order.status || "").toLowerCase();

  // ✅ User bấm "Xác nhận vận chuyển" (CONFIRMED -> SHIPPING)
  const handleConfirmShipping = async () => {
    try {
      await orderAPI.confirmShipping(order.id);
      alert("Xác nhận vận chuyển thành công!");

      if (onReload) {
        onReload();
      }
    } catch (error) {
      console.error(error);
      alert("Xác nhận vận chuyển thất bại, vui lòng thử lại!");
    }
  };

  // ✅ User bấm "Đã nhận hàng" (SHIPPING -> DELIVERED)
  const handleConfirmReceived = async () => {
    try {
      await orderAPI.confirmReceived(order.id);
      alert("Xác nhận đã nhận hàng thành công!");

      // Nếu parent có truyền onReload (ví dụ fetchOrders), gọi lại để load trạng thái mới
      if (onReload) {
        onReload();
      }
    } catch (error) {
      console.error(error);
      alert("Xác nhận nhận hàng thất bại, vui lòng thử lại!");
    }
  };

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

          <OrderStatusBadge status={status} />
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
        <button
          type="button"
          className="order-card__toggle"
          onClick={onToggle}
        >
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

            {/* Số điện thoại */}
            <div className="order-card__phone">
              <p className="order-card__section-title">Số điện thoại</p>
              <p className="order-card__phone-text">{order.customerPhone}</p>
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

        {/* Status Info */}
        <div className="order-card__status-info">
          {status === "pending" && (
            <p className="order-card__status-message">
              ⏳ Chờ admin xác nhận đơn hàng
            </p>
          )}
          {status === "paid" && (
            <p className="order-card__status-message status-paid">
              ✅ Đơn hàng đã được thanh toán. Chuẩn bị giao hàng
            </p>
          )}
          {status === "shipped" && (
            <>
              <p className="order-card__status-message status-shipped">
                🚚 Đơn hàng đang được giao đến bạn
              </p>
              <button
                type="button"
                className="order-btn order-btn--green"
                onClick={handleConfirmReceived}
              >
                Xác nhận đã nhận hàng
              </button>
            </>
          )}
          {status === "completed" && (
            <p className="order-card__status-message status-completed">
              ✓ Đã hoàn thành. Cảm ơn bạn đã mua sắm!
            </p>
          )}
          {status === "cancelled" && (
            <p className="order-card__status-message status-cancelled">
              ✗ Đơn hàng đã bị hủy
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
