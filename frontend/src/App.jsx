import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import AdminFlashSalePage from "./pages/admin/AdminFlashSalePage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
