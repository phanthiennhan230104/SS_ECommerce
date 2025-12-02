// src/components/flashsale/FlashSaleManagement.jsx
import React, { useState, useMemo } from "react";
import { Percent, Clock, Plus, X } from "lucide-react";

const mockFlashSales = [
  {
    id: 1,
    productName: "iPhone 15 Pro Max 256GB",
    productId: 1,
    basePrice: 29990000,
    discountPercent: 15,
    flashPrice: 25491500,
    startTime: "2025-12-01T08:00",
    endTime: "2025-12-01T23:59",
  },
  {
    id: 2,
    productName: 'MacBook Pro 14" M3',
    productId: 2,
    basePrice: 45990000,
    discountPercent: 10,
    flashPrice: 41391000,
    startTime: "2025-12-05T09:00",
    endTime: "2025-12-05T21:00",
  },
];

function getStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return "UPCOMING";
  if (now > end) return "ENDED";
  return "LIVE";
}

function formatStatusLabel(status) {
  if (status === "LIVE") return "Đang diễn ra";
  if (status === "UPCOMING") return "Sắp diễn ra";
  return "Đã kết thúc";
}

function formatCurrency(vnd) {
  return `₫${vnd.toLocaleString("vi-VN")}`;
}

export function FlashSaleManagement() {
  const [items, setItems] = useState(mockFlashSales);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    productId: "",
    basePrice: "",
    discountPercent: "",
    startTime: "",
    endTime: "",
  });

  // TÍNH flashPrice theo công thức: price * (100 - discount) / 100
  const flashPrice = useMemo(() => {
    const price = parseFloat(form.basePrice || "0");
    const discount = parseFloat(form.discountPercent || "0");
    if (isNaN(price) || isNaN(discount)) return 0;
    return Math.round((price * (100 - discount)) / 100);
  }, [form.basePrice, form.discountPercent]);

  const filteredItems = items.filter((item) => {
    const status = getStatus(item.startTime, item.endTime);
    const matchSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      String(item.productId).includes(search);
    const matchStatus =
      statusFilter === "all" ? true : status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalLive = items.filter(
    (x) => getStatus(x.startTime, x.endTime) === "LIVE"
  ).length;
  const totalUpcoming = items.filter(
    (x) => getStatus(x.startTime, x.endTime) === "UPCOMING"
  ).length;
  const totalEnded = items.filter(
    (x) => getStatus(x.startTime, x.endTime) === "ENDED"
  ).length;

  function openCreateModal() {
    setEditingItem(null);
    setForm({
      productName: "",
      productId: "",
      basePrice: "",
      discountPercent: "",
      startTime: "",
      endTime: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setForm({
      productName: item.productName,
      productId: item.productId,
      basePrice: item.basePrice,
      discountPercent: item.discountPercent,
      startTime: item.startTime.slice(0, 16),
      endTime: item.endTime.slice(0, 16),
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    // ở đây gọi API Spring Boot cũng được
    if (!form.productName || !form.basePrice || !form.discountPercent) {
      alert("Vui lòng nhập đầy đủ Tên sản phẩm, Giá gốc và % giảm");
      return;
    }

    if (!form.startTime || !form.endTime) {
      alert("Vui lòng chọn thời gian bắt đầu / kết thúc");
      return;
    }

    if (editingItem) {
      // UPDATE
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                productName: form.productName,
                productId: form.productId || it.productId,
                basePrice: Number(form.basePrice),
                discountPercent: Number(form.discountPercent),
                flashPrice: flashPrice,
                startTime: form.startTime,
                endTime: form.endTime,
              }
            : it
        )
      );
    } else {
      // CREATE
      const newItem = {
        id: items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1,
        productName: form.productName,
        productId: form.productId || null,
        basePrice: Number(form.basePrice),
        discountPercent: Number(form.discountPercent),
        flashPrice: flashPrice,
        startTime: form.startTime,
        endTime: form.endTime,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setIsModalOpen(false);
  }

  function handleDelete(id) {
    if (!window.confirm("Xóa flash sale này?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="flash-page-wrapper">
      <div className="flash-page">
        {/* HEADER */}
        <div className="flash-header">
          <div>
            <h1 className="flash-header-title">Quản lý Flash Sale</h1>
            <p className="flash-header-subtitle">
              Thêm / sửa / xóa chương trình flash sale và thời gian áp dụng
            </p>
          </div>
          <button
            type="button"
            className="flash-add-btn"
            onClick={openCreateModal}
          >
            <Plus />
            Thêm Flash Sale
          </button>
        </div>

        {/* STATS */}
        <div className="flash-stats-grid">
          <div className="flash-stat-card">
            <div className="flash-stat-title">Đang diễn ra</div>
            <div className="flash-stat-value">{totalLive}</div>
            <div className="flash-stat-meta">Flash sale đang active</div>
          </div>
          <div className="flash-stat-card">
            <div className="flash-stat-title">Sắp diễn ra</div>
            <div className="flash-stat-value">{totalUpcoming}</div>
            <div className="flash-stat-meta">Chưa tới giờ bắt đầu</div>
          </div>
          <div className="flash-stat-card">
            <div className="flash-stat-title">Đã kết thúc</div>
            <div className="flash-stat-value">{totalEnded}</div>
            <div className="flash-stat-meta">Hết thời gian áp dụng</div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flash-toolbar">
          <input
            className="flash-search-input"
            placeholder="Tìm theo tên sản phẩm hoặc ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="flash-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="LIVE">Đang diễn ra</option>
            <option value="UPCOMING">Sắp diễn ra</option>
            <option value="ENDED">Đã kết thúc</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="flash-table-card">
          <div className="flash-table-wrapper">
            <table className="flash-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sản phẩm</th>
                  <th>Giá gốc</th>
                  <th>% Giảm</th>
                  <th>Giá Flash</th>
                  <th>Bắt đầu</th>
                  <th>Kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const status = getStatus(item.startTime, item.endTime);
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.productName}</td>
                      <td>{formatCurrency(item.basePrice)}</td>
                      <td>{item.discountPercent}%</td>
                      <td>{formatCurrency(item.flashPrice)}</td>
                      <td>{item.startTime.replace("T", " ")}</td>
                      <td>{item.endTime.replace("T", " ")}</td>
                      <td>
                        <span
                          className={
                            "flash-status-pill " +
                            (status === "LIVE"
                              ? "flash-status-live"
                              : status === "UPCOMING"
                              ? "flash-status-upcoming"
                              : "flash-status-ended")
                          }
                        >
                          {formatStatusLabel(status)}
                        </span>
                      </td>
                      <td>
                        <div className="flash-actions">
                          <button
                            type="button"
                            className="flash-btn-icon edit"
                            onClick={() => openEditModal(item)}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="flash-btn-icon delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={9}>Chưa có flash sale nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL ADD/EDIT */}
        {isModalOpen && (
          <div className="flash-modal-backdrop">
            <div className="flash-modal">
              <div className="flash-modal-header">
                <div className="flash-modal-title">
                  {editingItem ? "Sửa Flash Sale" : "Thêm Flash Sale"}
                </div>
                <button
                  type="button"
                  className="flash-modal-close"
                  onClick={closeModal}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flash-modal-body">
                <div className="flash-field">
                  <label>Tên sản phẩm</label>
                  <input
                    name="productName"
                    value={form.productName}
                    onChange={handleChange}
                    placeholder="VD: iPhone 15 Pro Max 256GB"
                  />
                </div>

                <div className="flash-field">
                  <label>ID sản phẩm (tùy chọn, map với DB)</label>
                  <input
                    name="productId"
                    value={form.productId}
                    onChange={handleChange}
                    placeholder="VD: 1"
                  />
                </div>

                <div className="flash-field">
                  <label>Giá gốc (VND)</label>
                  <input
                    name="basePrice"
                    type="number"
                    min="0"
                    value={form.basePrice}
                    onChange={handleChange}
                    placeholder="29990000"
                  />
                </div>

                <div className="flash-field">
                  <label>% giảm</label>
                  <input
                    name="discountPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={form.discountPercent}
                    onChange={handleChange}
                    placeholder="15"
                  />
                </div>

                <div className="flash-field">
                  <label>
                    Giá flash (tự tính) – công thức: giá gốc × (100 - % giảm) /
                    100
                  </label>
                  <input
                    readOnly
                    value={flashPrice ? flashPrice.toLocaleString("vi-VN") : ""}
                  />
                </div>

                <div className="flash-field">
                  <label>Thời gian bắt đầu</label>
                  <input
                    name="startTime"
                    type="datetime-local"
                    value={form.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="flash-field">
                  <label>Thời gian kết thúc</label>
                  <input
                    name="endTime"
                    type="datetime-local"
                    value={form.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flash-modal-footer">
                <button
                  type="button"
                  className="flash-btn-secondary"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="flash-btn-primary"
                  onClick={handleSave}
                >
                  Lưu Flash Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
