import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Para manejar cookies de sesión
});

// Servicios de autenticación
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Servicios para gestionar usuarios (admin)
export const userService = {
  getAllUsers: () => api.get('/users'),
  updateUserRole: (userId, newRole) => api.put('/users/update-role', { userId, newRole }),
};

// Servicios para convocatorias
export const convocatoriasService = {
  getAll: () => api.get('/convocatorias'),
  getById: (id) => api.get(`/convocatorias/${id}`),
  getDetalle: (id) => api.get(`/convocatorias/${id}/detalle`),
  getProyectos: (id) => api.get(`/convocatorias/${id}/proyectos`),
  create: (convocatoriaData) => api.post('/convocatorias', convocatoriaData),
  update: (id, convocatoriaData) => api.put(`/convocatorias/${id}`, convocatoriaData),
  toggleAbierta: (id) => api.patch(`/convocatorias/${id}/toggle-abierta`),
  delete: (id) => api.delete(`/convocatorias/${id}`),
};

// Servicios para proyectos
export const proyectosService = {
  getAll: () => api.get('/proyectos'),
  getGanadores: () => api.get('/proyectos/ganadores'),
  getById: (id) => api.get(`/proyectos/${id}`),
  getMisProyectos: () => api.get('/proyectos/usuario/mis-proyectos'),
  create: (proyectoData) => api.post('/proyectos', proyectoData),
  update: (id, proyectoData) => api.put(`/proyectos/${id}`, proyectoData),
  toggleGanador: (id) => api.patch(`/proyectos/${id}/toggle-ganador`),
  delete: (id) => api.delete(`/proyectos/${id}`),
};

export default api;