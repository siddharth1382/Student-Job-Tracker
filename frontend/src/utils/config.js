// // API configuration
// // export const API_URL = 'http://localhost:3000';
// export const API_URL = 'https://student-job-tracker-8td8.onrender.com';


// // Routes
// export const ROUTES = {
//   AUTH: {
//     REGISTER: `${API_URL}/api/auth/register`,
//     LOGIN: `${API_URL}/api/auth/login`,
//   },
//   JOBS: {
//     BASE: `${API_URL}/api/jobs`,
//     GET_ALL: `${API_URL}/api/jobs`,
//     CREATE: `${API_URL}/api/jobs`,
//     UPDATE: (id) => `${API_URL}/api/jobs/${id}`,
//     DELETE: (id) => `${API_URL}/api/jobs/${id}`,
//   },
//   HEALTH: `${API_URL}/health`,
// };

// // Helper for API requests
// export const fetchWithAuth = async (url, options = {}) => {
//   const user = JSON.parse(localStorage.getItem('job-user') || '{}');
//   const token = user.token;

//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//   };

//   return fetch(url, { ...defaultOptions, ...options });
// }; 


// API configuration using environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Routes
export const ROUTES = {
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
  },
  JOBS: {
    BASE: `${API_URL}/jobs`,
    GET_ALL: `${API_URL}/jobs`,
    CREATE: `${API_URL}/jobs`,
    UPDATE: (id) => `${API_URL}/jobs/${id}`,
    DELETE: (id) => `${API_URL}/jobs/${id}`,
  },
  HEALTH: `${API_URL}/health`, // Assuming /api/health exists
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
