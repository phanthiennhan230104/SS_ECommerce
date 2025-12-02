// src/components/admin/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Package, Zap } from "lucide-react";

export function Sidebar({ activePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">Admin Panel</div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          

          <li>
            <Link
              to="/admin-user"
              className={`sidebar-button ${
                activePage === "users" ? "active" : ""
              }`}
            >
              <Users />
              <span>Quản lý User</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin-product"
              className={`sidebar-button ${
                activePage === "products" ? "active" : ""
              }`}
            >
              <Package />
              <span>Quản lý Sản phẩm</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin-flash-sale"
              className={`sidebar-button ${
                activePage === "flash-sale" ? "active" : ""
              }`}
            >
              <Zap />
              <span>Flash Sale</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
