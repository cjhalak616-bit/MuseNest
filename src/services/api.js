
const API_URL = 'https://musenest-api.onrender.com';

export const getToken = () => {
  return localStorage.getItem('museNestToken');
};

export const saveToken = (token) => {
  localStorage.setItem('museNestToken', token);
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
