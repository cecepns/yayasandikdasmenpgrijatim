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
  const rootBase = apiBase.replace(/\/api\/?$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${rootBase}${normalizedPath}`;
};

export const getMediaUrl = getImageUrl;

/**
 * Extracts and returns a clean YouTube embed URL from various YouTube link formats.
 * @param {string} url
 * @returns {string|null}
 */
export const getYoutubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already an embed URL
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  try {
    // Matches youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = trimmed.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  } catch {
    return null;
  }

  return null;
};

