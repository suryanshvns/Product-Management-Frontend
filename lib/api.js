import { get, post, patch, put, del } from '@/lib/apiClient';

export const healthApi = {
  health: () => get('/health'),
  ping: () => get('/ping'),
};

export const usersApi = {
  list: (params = {}) => get('/users', params),
  getById: (id) => get(`/users/${id}`),
  update: (id, body) => patch(`/users/${id}`, body),
};

export const rolesApi = {
  list: () => get('/roles'),
  assign: (userId, roleId) => post(`/roles/users/${userId}/roles`, { roleId }),
  revoke: (userId, roleId) => del(`/roles/users/${userId}/roles/${roleId}`),
};

export const productsApi = {
  list: (params = {}) => get('/products', params),
  getById: (id) => get(`/products/${id}`),
  create: (body) => post('/products', body),
  update: (id, body) => patch(`/products/${id}`, body),
  delete: (id) => del(`/products/${id}`),
  updateStatus: (id, body) => patch(`/products/${id}/status`, body),
  updateStock: (id, body) => patch(`/products/${id}/stock`, body),
  bulkDelete: (body) => post('/products/bulk-delete', body),
  bulkUpdateStatus: (body) => post('/products/bulk-update-status', body),
  uploadImages: (productId, formData) => post(`/products/${productId}/images`, formData, true),
  deleteImage: (productId, imageId) => del(`/products/${productId}/images/${imageId}`),
};

export const categoriesApi = {
  list: (params = {}) => get('/categories', params),
  getById: (id) => get(`/categories/${id}`),
  create: (body) => post('/categories', body),
  update: (id, body) => patch(`/categories/${id}`, body),
  delete: (id) => del(`/categories/${id}`),
};

export const analyticsApi = {
  overview: () => get('/analytics/overview'),
  productsByCategory: () => get('/analytics/products-by-category'),
  topProducts: (params = {}) => get('/analytics/top-products', params),
  inventoryStatus: () => get('/analytics/inventory-status'),
};

export const ordersApi = {
  list: (params = {}) => get('/orders', params),
  create: (body) => post('/orders', body),
  updateStatus: (id, body) => patch(`/orders/${id}/status`, body),
};

export const organizationsApi = {
  list: (params = {}) => get('/organizations', params),
  create: (body) => post('/organizations', body),
};

export const logsApi = {
  list: (params = {}) => get('/logs', params),
};

export const notificationsApi = {
  list: (params = {}) => get('/notifications', params),
};

export const alertRulesApi = {
  list: (params = {}) => get('/alert-rules', params),
};

export const reportsApi = {
  sales: (params = {}) => get('/reports/sales', params),
  inventory: (params = {}) => get('/reports/inventory', params),
};

export const dashboardApi = {
  summary: (params) => get('/dashboard/summary', params),
};

export const settingsApi = {
  list: (params = {}) => get('/settings/list', params),
  update: (body) => put('/settings', body),
};

export const apiKeysApi = {
  list: (params = {}) => get('/api-keys', params),
  create: (body) => post('/api-keys', body),
};

export const webhooksApi = {
  list: (params = {}) => get('/webhooks', params),
  create: (body) => post('/webhooks', body),
};

export const bulkApi = {
  importProducts: (body) => post('/bulk/import/products', body),
};
