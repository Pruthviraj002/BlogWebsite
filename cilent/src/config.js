export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';


export const getSafeImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return url;

    // Handle full URLs (e.g., from external sources or saved with old ports)
    if (url.startsWith('http')) {
        // Normalize all localhost images to the current backend port (5001)
        return url.replace(/localhost:500(0|2)/, 'localhost:5001');
    }

    // Handle relative paths from backend
    if (url.startsWith('uploads/') || url.startsWith('/uploads/')) {
        const baseUrl = API_BASE_URL.replace('/api', '');
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    return url;
};
