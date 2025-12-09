import axiosClient from "./axiosClient";

const analyticsAPI = {
  getOnlineUsers: () =>
    axiosClient.get("/auth/online-users")
      .catch(err => {
        console.error("API ERROR:", err);
        throw err;
      }),
};

export default analyticsAPI;
