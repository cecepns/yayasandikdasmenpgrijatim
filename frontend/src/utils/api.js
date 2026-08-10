import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.kingcreativestudio.my.id/yayasan-pgri-jatim/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Terjadi kesalahan pada server";
    return Promise.reject(new Error(message));
  }
);
