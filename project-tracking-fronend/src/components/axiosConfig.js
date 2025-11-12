import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.33.19.60:8080", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
