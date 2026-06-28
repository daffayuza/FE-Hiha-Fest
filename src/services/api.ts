const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to check for auth errors and redirect if necessary
const handleAuthError = (status: number) => {
  if (status === 401 || status === 403) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  }
};

export const api = {
  // Events
  getEvents: async () => {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  getAdminEvents: async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      handleAuthError(res.status);
      throw new Error('Failed to fetch events');
    }
    return res.json();
  },

  getEventById: async (id: string) => {
    const res = await fetch(`${API_URL}/events/${id}`);
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
  },

  // Checkout — now returns snapToken for Midtrans Snap popup
  createCheckout: async (data: any) => {
    const res = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create checkout');
    }
    return res.json();
  },

  // Order Lookup
  lookupOrder: async (query: string) => {
    const res = await fetch(`${API_URL}/checkout/lookup?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to look up order');
    return res.json();
  },

  // Payment Status — check transaction status after Snap popup
  getPaymentStatus: async (orderNumber: string) => {
    const res = await fetch(`${API_URL}/checkout/status/${orderNumber}`);
    if (!res.ok) throw new Error('Failed to fetch payment status');
    return res.json();
  },

  // Event Management (Admin)
  createEvent: async (data: any) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      handleAuthError(res.status);
      const err = await res.json();
      throw new Error(err.message || 'Failed to create event');
    }
    return res.json();
  },

  updateEvent: async (id: string, data: any) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      handleAuthError(res.status);
      const err = await res.json();
      throw new Error(err.message || 'Failed to update event');
    }
    return res.json();
  },

  deleteEvent: async (id: string) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      handleAuthError(res.status);
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete event');
    }
    return res.json();
  },

  // Admin
  adminLogin: async (credentials: any) => {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  getDashboardStats: async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      handleAuthError(res.status);
      throw new Error('Failed to fetch dashboard stats');
    }
    return res.json();
  },

  getTransactions: async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_URL}/admin/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      handleAuthError(res.status);
      throw new Error('Failed to fetch transactions');
    }
    return res.json();
  },

  getTransactionById: async (id: string) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_URL}/admin/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      handleAuthError(res.status);
      throw new Error('Failed to fetch transaction detail');
    }
    return res.json();
  },
};
