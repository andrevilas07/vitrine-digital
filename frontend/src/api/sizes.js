import api from './client';

export function getSizes() {
  return api.get('/sizes').then((res) => res.data.data);
}

export function createSize(payload) {
  return api.post('/sizes', payload).then((res) => res.data.data);
}

export function updateSize(id, payload) {
  return api.put(`/sizes/${id}`, payload).then((res) => res.data.data);
}

export function deleteSize(id) {
  return api.delete(`/sizes/${id}`);
}
