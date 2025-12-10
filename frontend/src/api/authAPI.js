import axiosClient from "./axiosClient";

const authAPI = {
  login: async (email, password) => {
    const res = await axiosClient.post("/auth/login", {
      email,
      password,
    });

    const token = res.data?.token;

    if (token) {
      localStorage.setItem("token", token);
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return res;
  },

  logout: () => {
    localStorage.removeItem("token");
    delete axiosClient.defaults.headers.common["Authorization"];
    return Promise.resolve();
  },
};

export default authAPI;
