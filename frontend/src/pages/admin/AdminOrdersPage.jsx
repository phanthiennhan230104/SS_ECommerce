import React, { useEffect, useState } from "react";
import orderAPI from "../../api/orderAPI";
import AdminLayout from "../../components/admin/AdminLayout";
import "../../styles/admin/order.css";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await orderAPI.getAdminOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirm = async (orderId) => {
    try {
      setUpdatingId(orderId);
      setError("");
      await orderAPI.confirmOrderAsAdmin(orderId);
      await fetchOrders();
    } catch (err) {
      console.error(err);
      setError("Xác nhận đơn thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }
    try {
      setUpdatingId(orderId);
      setError("");
      await orderAPI.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      console.error(err);
      setError("Hủy đơn thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusLabel = (status) => {
    switch ((status || "").toUpperCase()) {
      case "PENDING":
        return "Chờ xác nhận";
      case "PAID":
        return "Đã thanh toán";
      case "SHIPPED":
        return "Đang vận chuyển";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch ((status || "").toUpperCase()) {
      case "PENDING":
        return "status-pending";
      case "PAID":
        return "status-paid";
      case "SHIPPED":
        return "status-shipping";
      case "COMPLETED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const pendingCount = orders.filter(
    (o) => (o.status || "").toUpperCase() === "PENDING"
  ).length;
  const paidCount = orders.filter(
    (o) => (o.status || "").toUpperCase() === "PAID"
  ).length;
  const shippingCount = orders.filter(
    (o) => (o.status || "").toUpperCase() === "SHIPPED"
  ).length;
  const completedCount = orders.filter(
    (o) => (o.status || "").toUpperCase() === "COMPLETED"
  ).length;

  return (
    <AdminLayout activePage="orders">
      <div className="admin-orders-page">
        <div className="admin-orders-header">
          <h1 className="admin-orders-title">📦 Quản lý Đơn Hàng</h1>
        </div>

      {/* Stats */}
      <div className="admin-orders-stats">
        <div className="admin-order-stat">
          <div className="admin-order-stat-label">Chờ xác nhận</div>
          <div className="admin-order-stat-value">{pendingCount}</div>
        </div>
        <div className="admin-order-stat">
          <div className="admin-order-stat-label">Đã thanh toán</div>
          <div className="admin-order-stat-value">{paidCount}</div>
        </div>
        <div className="admin-order-stat">
          <div className="admin-order-stat-label">Đang vận chuyển</div>
          <div className="admin-order-stat-value">{shippingCount}</div>
        </div>
        <div className="admin-order-stat">
          <div className="admin-order-stat-label">Hoàn thành</div>
          <div className="admin-order-stat-value">{completedCount}</div>
        </div>
        <div className="admin-order-stat">
          <div className="admin-order-stat-label">Tổng đơn</div>
          <div className="admin-order-stat-value">{orders.length}</div>
        </div>
      </div>

      {/* Error */}
      {error && <div className="admin-orders-error">{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="admin-orders-loading">⏳ Đang tải dữ liệu...</div>
      ) : orders.length === 0 ? (
        <div className="admin-orders-empty">Không có đơn hàng nào.</div>
      ) : (
        <div className="admin-orders-table-container">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderCode}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerPhone}</td>
                  <td>{order.totalAmount?.toLocaleString("vi-VN")} đ</td>
                  <td>
                    <span
                      className={`order-status-badge ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {renderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td>
                    <div className="order-action-group">
                      {(order.status || "").toUpperCase() === "PENDING" && (
                        <button
                          className="order-action-btn order-action-btn-primary"
                          disabled={updatingId === order.id}
                          onClick={() => handleConfirm(order.id)}
                        >
                          {updatingId === order.id ? "..." : "Xác nhận"}
                        </button>
                      )}
                      {(order.status || "").toUpperCase() !== "CANCELLED" && (
                        <button
                          className="order-action-btn order-action-btn-danger"
                          disabled={updatingId === order.id}
                          onClick={() => handleCancel(order.id)}
                          title="Hủy đơn hàng"
                        >
                          {updatingId === order.id ? "..." : "Hủy"}
                        </button>
                      )}
                      {(order.status || "").toUpperCase() === "CANCELLED" && (
                        <button
                          className="order-action-btn order-action-btn-secondary"
                          disabled
                        >
                          Đã hủy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;