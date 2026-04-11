export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper to retrieve token natively
const getToken = () => localStorage.getItem('hive_token');

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  post: async (endpoint, data, isMultipart = false) => {
    const headers = {
      'Authorization': `Bearer ${getToken()}`
    };
    
    // Standard json requests need Content-Type explicitly.
    // Multipart (FormData) must NEVER have a manually defined Content-Type.
    if (!isMultipart && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isMultipart || data instanceof FormData ? data : JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  put: async (endpoint, data, isMultipart = false) => {
    const headers = {
      'Authorization': `Bearer ${getToken()}`
    };
    
    if (!isMultipart && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isMultipart || data instanceof FormData ? data : JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  patch: async (endpoint, data, isMultipart = false) => {
    const headers = {
      'Authorization': `Bearer ${getToken()}`
    };
    
    if (!isMultipart && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: isMultipart || data instanceof FormData ? data : JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (!res.ok) throw new Error(await res.text());
    if (res.status === 204) return null;
    return res.json();
  }
};
