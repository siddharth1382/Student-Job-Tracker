// API configuration
export const API_URL = 'http://localhost:3000';

// Routes
export const ROUTES = {
  AUTH: {
    REGISTER: `${API_URL}/api/auth/register`,
    LOGIN: `${API_URL}/api/auth/login`,
  },
  JOBS: {
    BASE: `${API_URL}/api/jobs`,
    GET_ALL: `${API_URL}/api/jobs`,
    CREATE: `${API_URL}/api/jobs`,
    UPDATE: (id) => `${API_URL}/api/jobs/${id}`,
    DELETE: (id) => `${API_URL}/api/jobs/${id}`,
  },
  HEALTH: `${API_URL}/health`,
};

// Helper for API requests
export const fetchWithAuth = async (url, options = {}) => {
  const user = JSON.parse(localStorage.getItem('job-user') || '{}');
  const token = user.token;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  return fetch(url, { ...defaultOptions, ...options });
}; 