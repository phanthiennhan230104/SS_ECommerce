import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import "../../styles/admin/flashsale.css";

const API_BASE = "http://localhost:8081/api/admin";

const AdminFlashSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/products`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Lỗi tải sản phẩm: ${res.status}`);
      }

      const data = await res.json();

      const mapped = data.map((p) => {
        const flashStart = p.flashStart ? p.flashStart.slice(0, 16) : "";
        const flashEnd = p.flashEnd ? p.flashEnd.slice(0, 16) : "";

        return {
          ...p,
          _flashConfig: {
            enabled: !!p.flashSale,
            mode: p.flashPrice ? "price" : "percent",
            flashPrice: p.flashPrice || "",
            discountPercent: "",
            flashStart,
            flashEnd,
          },
        };
      });

      setProducts(mapped);
    } catch (err) {
      console.error(err);
      setError(err.message || "Có lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const updateConfigField = (productId, field, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              _flashConfig: {
                ...p._flashConfig,
                [field]: value,
              },
            }
          : p
      )
    );
  };

  const handleModeChange = (productId, mode) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              _flashConfig: {
                ...p._flashConfig,
                mode,
              },
            }
          : p
      )
    );
  };

  const handleToggleEnabled = (productId, checked) => {
    updateConfigField(productId, "enabled", checked);
  };

  const handleSaveFlashSale = async (product) => {
    const cfg = product._flashConfig;
    setSavingId(product.id);
    setError("");
    setSuccess("");

    try {
      if (!cfg.enabled) {
        const body = {
          enabled: false,
          flashPrice: null,
          discountPercent: null,
          flashStart: null,
          flashEnd: null,
        };

        const res = await fetch(
          `${API_BASE}/products/${product.id}/flash-sale`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Lỗi tắt flash sale");
        }

        await res.json();
        setSuccess(`Đã tắt flash sale cho ${product.name}`);
        await fetchProducts();
        return;
      }

      if (!cfg.flashStart || !cfg.flashEnd) {
        throw new Error("Vui lòng chọn thời gian bắt đầu và kết thúc.");
      }

      const flashStart = cfg.flashStart + ":00";
      const flashEnd = cfg.flashEnd + ":00";

      let flashPrice = null;
      let discountPercent = null;

      if (cfg.mode === "price") {
        if (!cfg.flashPrice) {
          throw new Error("Vui lòng nhập giá flash sale.");
        }
        flashPrice = Number(cfg.flashPrice);
      } else {
        if (!cfg.discountPercent) {
          throw new Error("Vui lòng nhập % giảm giá.");
        }
        discountPercent = Number(cfg.discountPercent);
      }

      const body = {
        enabled: true,
        flashPrice,
        discountPercent,
        flashStart,
        flashEnd,
      };

      const res = await fetch(
        `${API_BASE}/products/${product.id}/flash-sale`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        }
      );

      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || "Lỗi cấu hình flash sale");
      }

      JSON.parse(text);
      setSuccess(`Đã cập nhật flash sale cho ${product.name}`);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || "Có lỗi khi lưu flash sale");
    } finally {
      setSavingId(null);
    }
  };

  // ===== JSX: dùng AdminLayout + Sidebar chung =====
  return (
    <AdminLayout active="flash-sale">
      <div className="flash-page-wrapper">
        <div className="flash-page">
          {/* Header */}
          <header className="flash-header">
            <div>
              <h1 className="flash-header-title">Quản lý Flash Sale</h1>
              <p className="flash-header-subtitle">
                Cài đặt giá và thời gian khuyến mãi cho sản phẩm.
              </p>
            </div>
            <button
              type="button"
              className="flash-add-btn"
              onClick={fetchProducts}
            >
              Làm mới danh sách
            </button>
          </header>

          {loading && <p>Đang tải dữ liệu...</p>}

          {error && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          {!loading && products.length === 0 && (
            <p>Không có sản phẩm nào.</p>
          )}

          {!loading && products.length > 0 && (
            <div className="flash-table-card">
              <div className="flash-table-wrapper">
                <table className="flash-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Giá gốc</th>
                      <th>Giá hiện tại</th>
                      <th>Bật Flash</th>
                      <th>Kiểu</th>
                      <th>Giá Flash / % Giảm</th>
                      <th>Bắt đầu</th>
                      <th>Kết thúc</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const cfg = p._flashConfig || {};
                      return (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.originalPrice ?? p.price}</td>
                          <td>{p.price}</td>

                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={cfg.enabled || false}
                              onChange={(e) =>
                                handleToggleEnabled(p.id, e.target.checked)
                              }
                            />
                          </td>

                          <td>
                            <select
                              className="border rounded px-2 py-1 text-sm"
                              value={cfg.mode || "price"}
                              onChange={(e) =>
                                handleModeChange(p.id, e.target.value)
                              }
                              disabled={!cfg.enabled}
                            >
                              <option value="price">Theo giá</option>
                              <option value="percent">Theo % giảm</option>
                            </select>
                          </td>

                          <td>
                            {cfg.mode === "percent" ? (
                              <input
                                type="number"
                                min="1"
                                max="99"
                                className="border rounded px-2 py-1 w-24 text-right text-sm"
                                placeholder="%"
                                value={cfg.discountPercent || ""}
                                onChange={(e) =>
                                  updateConfigField(
                                    p.id,
                                    "discountPercent",
                                    e.target.value
                                  )
                                }
                                disabled={!cfg.enabled}
                              />
                            ) : (
                              <input
                                type="number"
                                className="border rounded px-2 py-1 w-28 text-right text-sm"
                                placeholder="Giá flash"
                                value={cfg.flashPrice || ""}
                                onChange={(e) =>
                                  updateConfigField(
                                    p.id,
                                    "flashPrice",
                                    e.target.value
                                  )
                                }
                                disabled={!cfg.enabled}
                              />
                            )}
                          </td>

                          <td>
                            <input
                              type="datetime-local"
                              className="border rounded px-2 py-1 text-sm"
                              value={cfg.flashStart || ""}
                              onChange={(e) =>
                                updateConfigField(
                                  p.id,
                                  "flashStart",
                                  e.target.value
                                )
                              }
                              disabled={!cfg.enabled}
                            />
                          </td>

                          <td>
                            <input
                              type="datetime-local"
                              className="border rounded px-2 py-1 text-sm"
                              value={cfg.flashEnd || ""}
                              onChange={(e) =>
                                updateConfigField(
                                  p.id,
                                  "flashEnd",
                                  e.target.value
                                )
                              }
                              disabled={!cfg.enabled}
                            />
                          </td>

                          <td className="text-center">
                            <button
                              className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                              onClick={() => handleSaveFlashSale(p)}
                              disabled={savingId === p.id}
                            >
                              {savingId === p.id ? "Đang lưu..." : "Lưu"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFlashSalePage;
