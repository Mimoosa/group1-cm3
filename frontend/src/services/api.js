const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? { Authorization: `Bearer ${user.token}` } : {};
};

// Helper to handle API responses
const handleResponse = async (response) => {
  if (response.status === 401) {
    throw new Error('Authentication required. Please log in.');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Network response was not ok');
  }
  return response.status === 204 ? null : response.json();
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  }
};

export const jobApi = {
  getAllJobs: () => api.get('/jobs'),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`)
};

export const logApi = {
  createLog: (data) => api.post('/logs', data)
};