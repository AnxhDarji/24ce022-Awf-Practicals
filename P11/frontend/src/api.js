const BASE_URL = '/api';

async function request(path, options = {}, authenticated = false) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authenticated) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-expired'));
    }
    const error = new Error(data.error || 'Request failed.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export const register = (credentials) => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(credentials),
});
export const login = (credentials) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});
export const getMe = () => request('/me', {}, true);
export const getTasks = () => request('/tasks', {}, true);
export const createTask = (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }, true);
export const updateTask = (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }, true);
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' }, true);
