import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import OrderManagementPage from "./pages/order/OrderManagementPage";
import AdminFlashSalePage from "./pages/admin/AdminFlashSalePage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import CartPage from "./pages/cart/CartPage";
import CategoryPage from "./pages/category/CategoryPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-product"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-flash-sale"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminFlashSalePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/orders" element={<OrderManagementPage />} />
        
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
         {/* ADMIN: KHÔNG Header/Footer shop */}
        <Route path="/admin-user" element={<AdminUsersPage />} />
        <Route path="/admin-product" element={<AdminProductsPage />} />
        <Route path="/admin-flash-sale" element={<AdminFlashSalePage />} />
        <Route path="/admin-orders" element={<AdminOrdersPage />} />
        {/* Sai URL → quay về home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
