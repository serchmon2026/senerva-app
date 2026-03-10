const API_URL = 'https://senerva.com/api';

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const register = async ({ name, email, password, goal }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, goal }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrarse');
  return data;
};

export const login = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
  return data;
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
};

// ─── USER ─────────────────────────────────────────────────────────────────────

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
};

export const saveConversation = async (token, { agentId, messages, conversationId }) => {
  const res = await fetch(`${API_URL}/user/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ agentId, messages, conversationId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
};

export const getConversations = async (token) => {
  const res = await fetch(`${API_URL}/user/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
};

// ─── TOKEN HELPERS ────────────────────────────────────────────────────────────

export const saveToken = (token) => localStorage.setItem('senerva_token', token);
export const getToken = () => localStorage.getItem('senerva_token');
export const removeToken = () => localStorage.removeItem('senerva_token');
export const saveUser = (user) => localStorage.setItem('senerva_user', JSON.stringify(user));
export const getUser = () => {
  const u = localStorage.getItem('senerva_user');
  return u ? JSON.parse(u) : null;
};
export const removeUser = () => localStorage.removeItem('senerva_user');

export const logout = () => {
  removeToken();
  removeUser();
};