import React from "react";
import { Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";

const OrderStatusBadge = ({ status }) => {
  const configMap = {
    pending: {
      label: "Chờ xác nhận",
      icon: Clock,
      className: "order-status--pending",
    },
    paid: {
      label: "Đã thanh toán",
      icon: CheckCircle,
      className: "order-status--paid",
    },
    shipped: {
      label: "Đang vận chuyển",
      icon: Truck,
      className: "order-status--shipping",
    },
    completed: {
      label: "Hoàn thành",
      icon: Package,
      className: "order-status--delivered",
    },
    cancelled: {
      label: "Đã hủy",
      icon: XCircle,
      className: "order-status--cancelled",
    },
  };


  const config = configMap[status] || configMap.pending;
  const Icon = config.icon;

  return (
    <span className={`order-status ${config.className}`}>
      <Icon size={16} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
