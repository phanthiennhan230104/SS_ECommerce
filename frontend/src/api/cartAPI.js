import axiosClient from "./axiosClient";

const cartAPI = {
  getCart: () => axiosClient.get("/cart/cart"),

  addToCart: (productId, quantity) =>
    axiosClient.post("/cart/add", { productId, quantity }),

  updateItem: (productId, quantity) =>
    axiosClient.put("/cart/update", { productId, quantity }),

  removeItem: (productId) =>
    axiosClient.delete(`/cart/remove/${productId}`),
};

export default cartAPI;
