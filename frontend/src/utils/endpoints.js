export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
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
  },
  PENGURUS: {
    LIST: "/pengurus",
    CREATE: "/pengurus",
    UPDATE: (id) => `/pengurus/${id}`,
    DELETE: (id) => `/pengurus/${id}`,
  }
};
