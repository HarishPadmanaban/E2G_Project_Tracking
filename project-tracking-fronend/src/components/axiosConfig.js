import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://${window.location.hostname}:8081`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;