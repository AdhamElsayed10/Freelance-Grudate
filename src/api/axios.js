import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid — clear stored auth
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Only redirect if not already on login/join pages
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/join") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;