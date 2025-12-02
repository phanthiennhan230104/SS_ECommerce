import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
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
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/login" />} />
         {/* ADMIN: KHÔNG Header/Footer shop */}
        <Route path="/admin-user" element={<AdminUsersPage />} />
        <Route path="/admin-product" element={<AdminProductsPage />} />
        <Route path="/admin-flash-sale" element={<AdminFlashSalePage />} />
        {/* Sai URL → quay về home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
