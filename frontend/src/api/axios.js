import axios from "axios";
import useAuthStore from "../store/authStore"; // Adjust the path based on your project structure

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the Authorization header dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && !config.url.includes("/login/")) { 
      // Exclude the Authorization header for login requests
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
