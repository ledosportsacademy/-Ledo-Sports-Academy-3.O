// API service for Ledo Sports Academy

const API_URL = 'http://localhost:5000/api';

// Helper function for making API requests
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  const config = {
    method,
    headers,
    // Add cache-busting headers to the request
    cache: 'no-store'
  };

  if (data) {
    config.body = JSON.stringify(data);
  }
  
  // Add cache-busting timestamp to the URL
  const cacheBuster = `_t=${Date.now()}`;
  const separator = endpoint.includes('?') ? '&' : '?';
  const cacheBustedEndpoint = `${endpoint}${separator}${cacheBuster}`;

  try {
    const response = await fetch(`${API_URL}${cacheBustedEndpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API
const authAPI = {
  login: async (username, password) => {
    const data = await apiRequest('/admin/login', 'POST', { username, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
    }
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },
  getProfile: async () => {
    const token = localStorage.getItem('token');
    return await apiRequest('/admin/profile', 'GET', null, token);
  },
  updatePassword: async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token');
    return await apiRequest('/admin/password', 'PUT', { currentPassword, newPassword }, token);
  },
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },
  getToken: () => localStorage.getItem('token')
};

// Hero Slides API
const heroAPI = {
  getAll: async () => await apiRequest('/hero'),
  getById: async (id) => await apiRequest(`/hero/${id}`),
  create: async (slideData) => {
    const token = authAPI.getToken();
    return await apiRequest('/hero', 'POST', slideData, token);
  },
  update: async (id, slideData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/hero/${id}`, 'PUT', slideData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/hero/${id}`, 'DELETE', null, token);
  },
  updateOrder: async (orderData) => {
    const token = authAPI.getToken();
    return await apiRequest('/hero/order', 'PUT', orderData, token);
  }
};

// Activities API
const activitiesAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/activities${queryParams ? `?${queryParams}` : ''}`);
  },
  getRecent: async () => await apiRequest('/activities/recent'),
  getUpcoming: async () => await apiRequest('/activities/upcoming'),
  getById: async (id) => await apiRequest(`/activities/${id}`),
  create: async (activityData) => {
    const token = authAPI.getToken();
    return await apiRequest('/activities', 'POST', activityData, token);
  },
  update: async (id, activityData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/activities/${id}`, 'PUT', activityData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/activities/${id}`, 'DELETE', null, token);
  },
  updateStatus: async (id, status) => {
    const token = authAPI.getToken();
    return await apiRequest(`/activities/${id}/status`, 'PATCH', { status }, token);
  }
};

// Members API
const membersAPI = {
  getAll: async (filters = {}) => {
    const token = authAPI.getToken();
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/members${queryParams ? `?${queryParams}` : ''}`, 'GET', null, token);
  },
  getCount: async () => {
    const token = authAPI.getToken();
    return await apiRequest('/members/count', 'GET', null, token);
  },
  getById: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/members/${id}`, 'GET', null, token);
  },
  create: async (memberData) => {
    const token = authAPI.getToken();
    return await apiRequest('/members', 'POST', memberData, token);
  },
  update: async (id, memberData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/members/${id}`, 'PUT', memberData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/members/${id}`, 'DELETE', null, token);
  },
  updateStatus: async (id, isActive) => {
    const token = authAPI.getToken();
    return await apiRequest(`/members/${id}/status`, 'PATCH', { isActive }, token);
  }
};

// Donations API
const donationsAPI = {
  getAll: async (filters = {}) => {
    const token = authAPI.getToken();
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/donations${queryParams ? `?${queryParams}` : ''}`, 'GET', null, token);
  },
  getStats: async () => {
    const token = authAPI.getToken();
    return await apiRequest('/donations/stats', 'GET', null, token);
  },
  getById: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/donations/${id}`, 'GET', null, token);
  },
  create: async (donationData) => {
    const token = authAPI.getToken();
    return await apiRequest('/donations', 'POST', donationData, token);
  },
  update: async (id, donationData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/donations/${id}`, 'PUT', donationData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/donations/${id}`, 'DELETE', null, token);
  }
};

// Expenses API
const expensesAPI = {
  getAll: async (filters = {}) => {
    const token = authAPI.getToken();
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/expenses${queryParams ? `?${queryParams}` : ''}`, 'GET', null, token);
  },
  getStats: async () => {
    const token = authAPI.getToken();
    return await apiRequest('/expenses/stats', 'GET', null, token);
  },
  getById: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/expenses/${id}`, 'GET', null, token);
  },
  create: async (expenseData) => {
    const token = authAPI.getToken();
    return await apiRequest('/expenses', 'POST', expenseData, token);
  },
  update: async (id, expenseData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/expenses/${id}`, 'PUT', expenseData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/expenses/${id}`, 'DELETE', null, token);
  }
};

// Experiences API
const experiencesAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/experiences${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: async (id) => await apiRequest(`/experiences/${id}`),
  create: async (experienceData) => {
    const token = authAPI.getToken();
    return await apiRequest('/experiences', 'POST', experienceData, token);
  },
  update: async (id, experienceData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/experiences/${id}`, 'PUT', experienceData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/experiences/${id}`, 'DELETE', null, token);
  },
  addImages: async (id, images) => {
    const token = authAPI.getToken();
    return await apiRequest(`/experiences/${id}/images`, 'POST', { images }, token);
  },
  removeImages: async (id, imageIds) => {
    const token = authAPI.getToken();
    return await apiRequest(`/experiences/${id}/images`, 'DELETE', { imageIds }, token);
  }
};

// Weekly Fees API
const weeklyFeesAPI = {
  getAll: async (filters = {}) => {
    const token = authAPI.getToken();
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/weekly-fees${queryParams ? `?${queryParams}` : ''}`, 'GET', null, token);
  },
  getStats: async () => {
    const token = authAPI.getToken();
    return await apiRequest('/weekly-fees/stats', 'GET', null, token);
  },
  getByMember: async (memberId) => {
    const token = authAPI.getToken();
    return await apiRequest(`/weekly-fees/member/${memberId}`, 'GET', null, token);
  },
  getById: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/weekly-fees/${id}`, 'GET', null, token);
  },
  create: async (feeData) => {
    const token = authAPI.getToken();
    return await apiRequest('/weekly-fees', 'POST', feeData, token);
  },
  createBatch: async (weekData) => {
    const token = authAPI.getToken();
    return await apiRequest('/weekly-fees/batch', 'POST', weekData, token);
  },
  update: async (id, feeData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/weekly-fees/${id}`, 'PUT', feeData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/weekly-fees/${id}`, 'DELETE', null, token);
  }
};

// Gallery API
const galleryAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/gallery${queryParams ? `?${queryParams}` : ''}`);
  },
  getFeatured: async () => await apiRequest('/gallery/featured'),
  getById: async (id) => await apiRequest(`/gallery/${id}`),
  create: async (galleryData) => {
    const token = authAPI.getToken();
    return await apiRequest('/gallery', 'POST', galleryData, token);
  },
  update: async (id, galleryData) => {
    const token = authAPI.getToken();
    return await apiRequest(`/gallery/${id}`, 'PUT', galleryData, token);
  },
  delete: async (id) => {
    const token = authAPI.getToken();
    return await apiRequest(`/gallery/${id}`, 'DELETE', null, token);
  },
  updateFeaturedOrder: async (orderData) => {
    const token = authAPI.getToken();
    return await apiRequest('/gallery/featured/order', 'PUT', orderData, token);
  },
  toggleFeatured: async (id, featured) => {
    const token = authAPI.getToken();
    return await apiRequest(`/gallery/${id}/featured`, 'PATCH', { featured }, token);
  }
};

// File upload helper
async function uploadFile(file, endpoint) {
  const token = authAPI.getToken();
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'x-auth-token': token
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'File upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

// Export all API services
const API = {
  auth: authAPI,
  hero: heroAPI,
  activities: activitiesAPI,
  members: membersAPI,
  donations: donationsAPI,
  expenses: expensesAPI,
  experiences: experiencesAPI,
  weeklyFees: weeklyFeesAPI,
  gallery: galleryAPI,
  uploadFile
};

window.API = API; // Make API available globally