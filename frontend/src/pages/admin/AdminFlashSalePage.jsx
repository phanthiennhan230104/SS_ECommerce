// src/pages/admin/AdminFlashSalePage.jsx
import React from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { FlashSaleManagement } from "../../components/flashsale/FlashSaleManagement.jsx";
import "../../styles/admin/flashsale.css";

export default function AdminFlashSalePage() {
  return (
    <AdminLayout active="flash">
      <FlashSaleManagement />
    </AdminLayout>
  );
}
