import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to /login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/* ---- Auth ---- */
export const authRegister = (data) =>
  api.post('/auth/register', data);

export const authLogin = (email, password) => {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  return axios.post('/api/v1/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

/* ---- Students ---- */
export const getMyProfile   = ()       => api.get('/students/me');
export const createProfile  = (data)   => api.post('/students/', data);
export const updateProfile  = (data)   => api.put('/students/me', data);
export const listStudents   = ()       => api.get('/students/');

/* ---- AI ---- */
export const askAI = (prompt) => api.post('/ai/', { prompt });

export default api;
