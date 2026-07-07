import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://${window.location.hostname}:8080`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {

    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response && error.response.status === 401) {

      sessionStorage.clear();

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;