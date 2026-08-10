import { api } from "./api";

export const requestHandler = async (requestFn) => {
  try {
    const response = await requestFn();
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.message || "Gagal memproses permintaan" };
  }
};
