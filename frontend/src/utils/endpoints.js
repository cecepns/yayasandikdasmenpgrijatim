export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  BERITA: {
    LIST: "/berita",
    DETAIL: (id) => `/berita/${id}`,
    CREATE: "/berita",
    UPDATE: (id) => `/berita/${id}`,
    DELETE: (id) => `/berita/${id}`,
  },
  PERSURATAN: {
    LIST: "/persuratan",
    LACAK: (noResi) => `/persuratan/lacak/${noResi}`,
    CREATE: "/persuratan",
    UPDATE_STATUS: (id) => `/persuratan/${id}/status`,
    DELETE: (id) => `/persuratan/${id}`,
  },
  LEMBAGA: {
    LIST: "/lembaga",
    CREATE: "/lembaga",
    UPDATE: (id) => `/lembaga/${id}`,
    DELETE: (id) => `/lembaga/${id}`,
  },
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings"
  }
};
