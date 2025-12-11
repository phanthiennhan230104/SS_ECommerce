import React, { useState, useEffect } from "react";
import { Users, UserCheck, UserCog, Plus } from "lucide-react";
import { UserTable } from "./UserTable.jsx";
import axiosClient from "../../../api/axiosClient";

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // modal thêm user
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "CUSTOMER",
    status: "Active",
  });

  // modal sửa user
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Fetch users từ database
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosClient.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách user");
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const roleDistribution = {
    CUSTOMER: users.filter((u) => u.role === "CUSTOMER").length,
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

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    try {
      await axiosClient.post("/admin/users", newUser);
      await fetchUsers();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Thêm user thất bại");
    }
  };

  const handleOpenEdit = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditUser(null);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editUser.name.trim()) return;

    try {
      await axiosClient.patch(`/admin/users/${editUser.id}`, {
        name: editUser.name,
        role: editUser.role,
      });
      await fetchUsers();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError("Sửa user thất bại");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) {
      return;
    }
    try {
      const id = parseInt(userId);
      if (isNaN(id)) {
        setError("ID user không hợp lệ");
        return;
      }
      const response = await axiosClient.delete(`/admin/users/${id}`);
      console.log("Delete response:", response);
      await fetchUsers();
      setError("");
    } catch (err) {
      console.error("Delete error:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(`Xóa user thất bại: ${errorMsg}`);
    }
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

      {error && <div style={{color: 'red', padding: '10px', marginBottom: '10px'}}>{error}</div>}
      {loading && <div style={{padding: '10px', marginBottom: '10px'}}>⏳ Đang tải dữ liệu...</div>}

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
                {roleDistribution.CUSTOMER} / {roleDistribution.SELLER} /{" "}
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
              <option value="CUSTOMER">CUSTOMER</option>
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
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
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
                    <option value="CUSTOMER">CUSTOMER</option>
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

      {/* MODAL SỬA USER */}
      {showEditModal && editUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Sửa thông tin User</h2>
              <button
                type="button"
                className="modal-close"
                onClick={handleCloseEdit}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="modal-body">
              <div className="modal-field">
                <label>Họ tên</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-field">
                <label>Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  disabled
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              </div>

              <div className="modal-field">
                <label>Vai trò</label>
                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="SELLER">SELLER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn secondary"
                  onClick={handleCloseEdit}
                >
                  Hủy
                </button>
                <button type="submit" className="modal-btn primary">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
