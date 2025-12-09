import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const authAPI = {
  login: (email, password) => {
    return axios.post(`${API_URL}/login`, {
      email,
      password
    });
  }
};

export default authAPI;
