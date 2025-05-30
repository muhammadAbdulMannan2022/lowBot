import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://devidcyrus.duckdns.org/api",
  // baseURL: "http://devidcyrus.duckdns.org/api",
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token"); // Get token from local storage

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
