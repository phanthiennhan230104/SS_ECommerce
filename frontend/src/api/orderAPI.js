import axiosClient from "./axiosClient";

const orderAPI = {
  getOrders() {
    return axiosClient.get("/orders");
  },

  updateOrderStatus(orderId, status) {
    return axiosClient.patch(`/orders/${orderId}/status`, {
      status: status,
    });
  },
};

export default orderAPI;
