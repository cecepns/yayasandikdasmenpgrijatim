/**
 * Helper utility to build full image URLs from backend responses.
 * @param {string} path 
 * @returns {string}
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Get base URL from environment or fallback
  const apiBase = import.meta.env.VITE_API_URL || 'https://api.kingcreativestudio.my.id/yayasan-pgri-jatim/api';
  
  // Strip /api from baseURL if present to get origin/root server path
  const rootBase = apiBase.replace(/\/api\/?$/, '');

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${rootBase}${normalizedPath}`;
};
