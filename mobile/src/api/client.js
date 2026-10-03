const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://buildmate-backend.onrender.com';

export async function apiRequest(path, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

export const authApi = {
  signup: (payload) => apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

export const dashboardApi = {
  analytics: () => apiRequest('/api/analytics'),
  jobs: () => apiRequest('/api/jobs'),
  workers: () => apiRequest('/api/workers'),
  marketplace: () => apiRequest('/api/marketplace'),
  tickets: () => apiRequest('/api/support-tickets'),
};
