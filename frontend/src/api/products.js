import api from './client';

export function getProducts(filters = {}) {
  return api.get('/products', { params: filters }).then((res) => res.data.data);
}

export function getProduct(id) {
  return api.get(`/products/${id}`).then((res) => res.data.data);
}

export function createProduct(formData) {
  return api
    .post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data.data);
}

export function updateProduct(id, formData) {
  formData.append('_method', 'PUT');
  return api
    .post(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data.data);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}
