import axiosClient from "./axiosClient";

const orderAPI = {
  // USER: lấy đơn của user hiện tại
  getOrders() {
    return axiosClient.get("/orders");
  },

  // USER: update status thủ công (nếu bạn đang dùng chỗ khác)
  updateOrderStatus(orderId, status) {
    return axiosClient.patch(`/orders/${orderId}/status`, {
      status: status,
    });
  },

  // USER: xác nhận vận chuyển (PAID -> SHIPPED)
  confirmShipping(orderId) {
    return axiosClient.patch(`/orders/${orderId}/confirm-shipped`);
  },

  // USER: xác nhận đã nhận hàng (SHIPPED -> COMPLETED)
  confirmReceived(orderId) {
    return axiosClient.patch(`/orders/${orderId}/confirm-received`);
  },

  // ADMIN: lấy tất cả đơn
  getAdminOrders() {
    return axiosClient.get("/admin/orders");
  },

  // ADMIN: xác nhận đơn (PENDING -> SHIPPED)
  confirmOrderAsAdmin(orderId) {
    return axiosClient.patch(`/admin/orders/${orderId}/confirm`);
  },

  // ADMIN: hủy đơn
  cancelOrder(orderId) {
    return axiosClient.patch(`/admin/orders/${orderId}/cancel`);
  },
};

export default orderAPI;
