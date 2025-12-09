import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const sendOtp = (data) => {
  return axios.post(`${API}/send-otp`, data);
};

export const verifyOtp = (data) => {
  return axios.post(`${API}/verify-otp`, data);
};
