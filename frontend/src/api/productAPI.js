import axiosClient from "./axiosClient";

const productAPI = {
  // Lấy tất cả sản phẩm
  getAllProducts: () => axiosClient.get("/products"),
  
  // Lấy sản phẩm theo category
  getByCategory: (category) =>
    axiosClient.get(`/products/category/${category}`),
};

export default productAPI;
