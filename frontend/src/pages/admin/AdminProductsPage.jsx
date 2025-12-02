// src/pages/admin/AdminProductsPage.jsx
import React from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { ProductManagement } from "../../components/admin/products/ProductManagement.jsx";
import "../../styles/admin/product.css";

export default function AdminProductsPage() {
  return (
    <AdminLayout active="products">
      <ProductManagement />
    </AdminLayout>
  );
}
