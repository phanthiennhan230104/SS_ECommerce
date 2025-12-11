import axiosClient from "./axiosClient";

const productAPI = {
  // Lấy tất cả sản phẩm
  getAllProducts: () => axiosClient.get("/products"),
  
  // Lấy sản phẩm theo category
  getByCategory: (category) =>
    axiosClient.get(`/products/category/${category}`),

  // Admin: lấy tất cả sản phẩm (admin panel)
  adminGetAll: () => axiosClient.get("/admin/products"),

  // Admin: tạo sản phẩm
  adminCreate: (productData) => axiosClient.post("/admin/products", productData),

  // Admin: cập nhật sản phẩm
  adminUpdate: (productId, productData) =>
    axiosClient.put(`/admin/products/${productId}`, productData),

  // Admin: xoá sản phẩm
  adminDelete: (productId) =>
    axiosClient.delete(`/admin/products/${productId}`),

  // Admin: cấu hình flash sale
  adminConfigureFlashSale: (productId, flachSaleData) =>
    axiosClient.post(`/admin/products/${productId}/flash-sale`, flachSaleData),
};

export default productAPI;
