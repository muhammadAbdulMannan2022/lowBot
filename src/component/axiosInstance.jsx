import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://leapapp-d8gtazf2e9aygcc6.canadacentral-01.azurewebsites.net/api",
  // baseURL: "http://192.168.10.124:2100/api",
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
