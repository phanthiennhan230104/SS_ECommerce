import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Package, Zap, LogOut, ShoppingCart } from "lucide-react";



export function Sidebar({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    
    window.location.href = "http://localhost:5173/login";
    
  };

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

          <li>
            <Link
              to="/admin-orders"
              className={`sidebar-button ${
                activePage === "orders" ? "active" : ""
              }`}
            >
              <ShoppingCart />
              <span>Quản lý Đơn Hàng</span>
            </Link>
          </li>

          <li>
          <button
            type="button"
            className="sidebar-button sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut />
            <span>Đăng xuất</span>
          </button>
        </li>
        </ul>
      </nav>
    </aside>
  );
}
