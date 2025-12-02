// src/components/admin/AdminLayout.jsx
import React from "react";
import { Sidebar } from "../Sidebar.jsx";
import "../../styles/admin/admin.css"; 

export default function AdminLayout({ children, active }) {
  return (
    <div className="admin-shell">
      {/* Sidebar trái */}
      <Sidebar activePage={active} />

      {/* Nội dung chính */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
