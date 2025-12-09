import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const authAPI = {
  login: (email, password) => {
    return axios.post(`${API_URL}/login`, {
      email,
      password
    });

    const token = res.data.token; // backend trả về token ở field nào?

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
