import { get, post, patch, put, del } from '@/lib/apiClient';

export const healthApi = {
  health: () => get('/health'),
  ping: () => get('/ping'),
};

export const authApi = {
  signup: (body) => post('/auth/signup', body),
  login: (body) => post('/auth/login', body),
  logout: (body) => post('/auth/logout', body),
  me: () => get('/auth/me'),
  refreshToken: (body) => post('/auth/refresh-token', body),
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
  getById: (id) => get(`/orders/${id}`),
  create: (body) => post('/orders', body),
  updateStatus: (id, body) => patch(`/orders/${id}/status`, body),
};

export const organizationsApi = {
  list: (params = {}) => get('/organizations', params),
  getById: (id) => get(`/organizations/${id}`),
  create: (body) => post('/organizations', body),
  addMember: (orgId, body) => post(`/organizations/${orgId}/members`, body),
  listMembers: (orgId, params = {}) => get(`/organizations/${orgId}/members`, params),
};

export const logsApi = {
  list: (params = {}) => get('/logs', params),
};

export const notificationsApi = {
  list: (params = {}) => get('/notifications', params),
  markRead: (id) => patch(`/notifications/${id}/read`, {}),
  markAllRead: () => post('/notifications/read-all'),
};

export const alertRulesApi = {
  list: (params = {}) => get('/alert-rules', params),
  getById: (id) => get(`/alert-rules/${id}`),
  create: (body) => post('/alert-rules', body),
  update: (id, body) => patch(`/alert-rules/${id}`, body),
  delete: (id) => del(`/alert-rules/${id}`),
};

export const reportsApi = {
  sales: (params = {}) => get('/reports/sales', params),
  inventory: (params = {}) => get('/reports/inventory', params),
  exportProducts: (params = {}) => get('/reports/export/products', params),
};

export const dashboardApi = {
  summary: (params) => get('/dashboard/summary', params),
};

export const settingsApi = {
  get: (params = {}) => get('/settings', params),
  list: (params = {}) => get('/settings/list', params),
  update: (body) => put('/settings', body),
};

export const apiKeysApi = {
  list: (params = {}) => get('/api-keys', params),
  create: (body) => post('/api-keys', body),
  revoke: (id) => del(`/api-keys/${id}`),
};

export const webhooksApi = {
  list: (params = {}) => get('/webhooks', params),
  getById: (id) => get(`/webhooks/${id}`),
  create: (body) => post('/webhooks', body),
  update: (id, body) => patch(`/webhooks/${id}`, body),
  delete: (id) => del(`/webhooks/${id}`),
};

export const bulkApi = {
  importProducts: (body) => post('/bulk/import/products', body),
};
