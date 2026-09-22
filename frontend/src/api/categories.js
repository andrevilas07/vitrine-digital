import api from './client';

export function getCategories() {
  return api.get('/categories').then((res) => res.data.data);
}

export function createCategory(payload) {
  return api.post('/categories', payload).then((res) => res.data.data);
}

export function updateCategory(id, payload) {
  return api.put(`/categories/${id}`, payload).then((res) => res.data.data);
}

export function deleteCategory(id) {
  return api.delete(`/categories/${id}`);
}
