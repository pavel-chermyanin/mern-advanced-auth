import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

export const API_URL = "http://localhost:5000/api";


const $api = axios.create({
  // чтобы к каждому запросу автоматом цеплялись куки
  withCredentials: true,
  baseURL: API_URL,
});

// при каждом запросе получаем token из localStorage
// и в headers.Authorization запишем token
$api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  }
);

export default $api;
