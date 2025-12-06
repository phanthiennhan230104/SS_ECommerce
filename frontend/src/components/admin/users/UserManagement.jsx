import React, { useState } from "react";
import { Users, UserCheck, UserCog, Plus } from "lucide-react";
import { UserTable } from "./UserTable.jsx";

const initialUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "USER",   status: "Active" },
  { id: 2, name: "Trần Thị B",   email: "b@example.com", role: "ADMIN",  status: "Active" },
  { id: 3, name: "Lê Văn C",     email: "c@example.com", role: "SELLER", status: "Blocked" },
  { id: 4, name: "Phạm Thị D",   email: "d@example.com", role: "USER",   status: "Active" },
  { id: 5, name: "Hoàng Văn E",  email: "e@example.com", role: "SELLER", status: "Active" },
  { id: 6, name: "Vũ Thị F",     email: "f@example.com", role: "USER",   status: "Active" },
  { id: 7, name: "Đặng Văn G",   email: "g@example.com", role: "ADMIN",  status: "Active" },
  { id: 8, name: "Bùi Thị H",    email: "h@example.com", role: "USER",   status: "Blocked" },
];

export function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // modal thêm user
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "USER",
    status: "Active",
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const roleDistribution = {
    USER: users.filter((u) => u.role === "USER").length,
    SELLER: users.filter((u) => u.role === "SELLER").length,
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
  };

  const handleOpenAdd = () => {
    setNewUser({ name: "", email: "", role: "USER", status: "Active" });
    setShowAddModal(true);
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const userToAdd = {
      id: nextId,
      ...newUser,
    };

    setUsers([...users, userToAdd]);
    setShowAddModal(false);
  };

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý User</h1>
          <p className="page-subtitle">
            Quản lý và theo dõi người dùng trong hệ thống
          </p>
        </div>
        <button type="button" className="primary-btn" onClick={handleOpenAdd}>
          <Plus />
          Thêm User
        </button>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Tổng số User</div>
              <div className="card-value">{totalUsers}</div>
              <div className="card-change positive">
                +12% so với tháng trước
              </div>
            </div>
            <div className="card-icon">
              <Users />
            </div>
          </div>
          <div className="card-chart">
            {[40, 45, 48, 52, 55, 60].map((v, i) => (
              <div
                key={i}
                className="card-chart-bar"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">User đang hoạt động</div>
              <div className="card-value">{activeUsers}</div>
              <div className="card-change positive">
                +8% so với tháng trước
              </div>
            </div>
            <div className="card-icon">
              <UserCheck />
            </div>
          </div>
          <div className="card-chart">
            {[50, 52, 54, 56, 58, 60].map((v, i) => (
              <div
                key={i}
                className="card-chart-bar"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Phân bố vai trò</div>
              <div className="card-value">
                {roleDistribution.USER} / {roleDistribution.SELLER} /{" "}
                {roleDistribution.ADMIN}
              </div>
            </div>
            <div className="card-icon">
              <UserCog />
            </div>
          </div>
          <div className="card-chart">
            {[30, 40, 20].map((v, i) => (
              <div
                key={i}
                className="card-chart-bar"
                style={{ height: `${v + 20}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filters-inner">
          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="select-wrapper">
            <select
              className="select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="USER">USER</option>
              <option value="SELLER">SELLER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* User table */}
      <UserTable
        users={users}
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
      />

      {/* MODAL THÊM USER */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm User mới</h2>
              <button
                type="button"
                className="modal-close"
                onClick={handleCloseAdd}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="modal-body">
              <div className="modal-field">
                <label>Họ tên</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-field">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-row">
                <div className="modal-field">
                  <label>Vai trò</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="USER">USER</option>
                    <option value="SELLER">SELLER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label>Trạng thái</label>
                  <select
                    value={newUser.status}
                    onChange={(e) =>
                      setNewUser({ ...newUser, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn secondary"
                  onClick={handleCloseAdd}
                >
                  Hủy
                </button>
                <button type="submit" className="modal-btn primary">
                  Lưu User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
