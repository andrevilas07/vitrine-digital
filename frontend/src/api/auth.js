import api from './client';

export function login(email, password) {
  return api.post('/login', { email, password }).then((res) => res.data);
}

export function logout() {
  return api.post('/logout').then((res) => res.data);
}
