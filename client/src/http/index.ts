import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

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

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config.isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (error) {
        console.log("НЕ АВТОРИЗОВАН");
      }
    }
    throw error
  }
);

export default $api;
