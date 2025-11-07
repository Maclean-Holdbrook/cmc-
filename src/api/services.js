import axios from './axios';

// Staff Services
export const staffAPI = {
  submitComplaint: async (formData) => {
    const response = await axios.post('/staff/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getComplaints: async (email) => {
    const response = await axios.get(`/staff/complaints?email=${email}`);
    return response.data;
  },
  getComplaint: async (id) => {
    const response = await axios.get(`/staff/complaints/${id}`);
    return response.data;
  },
  getDepartments: async () => {
    const response = await axios.get('/staff/departments');
    return response.data;
  },
};

// Admin Services
export const adminAPI = {
  register: async (adminData) => {
    const response = await axios.post('/admin/register', adminData);
    return response.data;
  },
  login: async (email, password) => {
    const response = await axios.post('/admin/login', { email, password });
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await axios.get('/admin/dashboard/stats');
    return response.data;
  },
  getComplaints: async (params) => {
    const response = await axios.get('/admin/complaints', { params });
    return response.data;
  },
  createTicket: async (ticketData) => {
    const response = await axios.post('/admin/tickets', ticketData);
    return response.data;
  },
  updateTicket: async (id, ticketData) => {
    const response = await axios.put(`/admin/tickets/${id}`, ticketData);
    return response.data;
  },
  createWorker: async (workerData) => {
    const response = await axios.post('/admin/workers', workerData);
    return response.data;
  },
  getWorkers: async (params) => {
    const response = await axios.get('/admin/workers', { params });
    return response.data;
  },
  updateWorker: async (id, workerData) => {
    const response = await axios.put(`/admin/workers/${id}`, workerData);
    return response.data;
  },
  deleteWorker: async (id) => {
    const response = await axios.delete(`/admin/workers/${id}`);
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await axios.put('/admin/profile', profileData);
    return response.data;
  },
  updatePassword: async (passwordData) => {
    const response = await axios.put('/admin/password', passwordData);
    return response.data;
  },
};

// Worker Services
export const workerAPI = {
  login: async (email, password) => {
    const response = await axios.post('/worker/login', { email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await axios.get('/worker/profile');
    return response.data;
  },
  getStats: async () => {
    const response = await axios.get('/worker/stats');
    return response.data;
  },
  getTickets: async (params) => {
    const response = await axios.get('/worker/tickets', { params });
    return response.data;
  },
  getTicket: async (id) => {
    const response = await axios.get(`/worker/tickets/${id}`);
    return response.data;
  },
  updateTicketStatus: async (id, statusData) => {
    const response = await axios.put(`/worker/tickets/${id}/status`, statusData);
    return response.data;
  },
  addTicketUpdate: async (id, updateData) => {
    const response = await axios.post(`/worker/tickets/${id}/updates`, updateData);
    return response.data;
  },
};
