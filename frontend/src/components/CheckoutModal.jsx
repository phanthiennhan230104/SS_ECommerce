import { useState } from "react";
import { X, Loader } from "lucide-react";
import "../styles/CheckoutModal.css";

export default function CheckoutModal({ cart, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.customerName.trim()) {
      alert("❌ Vui lòng nhập tên khách hàng!");
      return;
    }
    if (!formData.customerEmail.trim()) {
      alert("❌ Vui lòng nhập email!");
      return;
    }
    if (!formData.customerPhone.trim()) {
      alert("❌ Vui lòng nhập số điện thoại!");
      return;
    }
    if (!formData.customerAddress.trim()) {
      alert("❌ Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal">
        {/* Header */}
        <div className="checkout-modal__header">
          <h2>Thông tin giao hàng</h2>
          <button
            className="checkout-modal__close"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="checkout-modal__form">
          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="checkout-summary__items">
              {cart.items.map((item) => {
                const lineTotal = item.lineTotal || (item.unitPrice * item.quantity);
                return (
                  <div key={item.id} className="checkout-summary__item">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>{lineTotal?.toLocaleString("vi-VN")} đ</span>
                  </div>
                );
              })}
            </div>
            <div className="checkout-summary__total">
              <strong>Tổng cộng:</strong>
              <strong className="checkout-summary__total-price">
                {cart.totalAmount?.toLocaleString("vi-VN")} đ
              </strong>
            </div>
          </div>

          {/* Divider */}
          <div className="checkout-modal__divider"></div>

          {/* Form Fields */}
          <div className="checkout-modal__fields">
            <div className="checkout-modal__field">
              <label>Tên khách hàng *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                disabled={isLoading}
              />
            </div>

            <div className="checkout-modal__field">
              <label>Email *</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <div className="checkout-modal__field">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="0912345678"
                disabled={isLoading}
              />
            </div>

            <div className="checkout-modal__field">
              <label>Địa chỉ giao hàng *</label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, phường, quận, thành phố"
                disabled={isLoading}
                rows="3"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="checkout-modal__actions">
            <button
              type="button"
              className="checkout-modal__cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="checkout-modal__submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đặt hàng"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
