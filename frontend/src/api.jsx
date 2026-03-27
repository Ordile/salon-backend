import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Không auto-alert — để từng component tự xử lý lỗi
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
