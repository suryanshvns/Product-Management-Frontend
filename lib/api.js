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

/** Product variants */
export const productVariantsApi = {
  create: (body) => post('/product-variants', body),
  list: (params = {}) => get('/product-variants', params),
  reorderSuggestions: () => get('/product-variants/reorder-suggestions'),
  getById: (id) => get(`/product-variants/${id}`),
  update: (id, body) => patch(`/product-variants/${id}`, body),
  updateStock: (id, body) => patch(`/product-variants/${id}/stock`, body),
  delete: (id) => del(`/product-variants/${id}`),
};

/** Tags */
export const tagsApi = {
  create: (body) => post('/tags', body),
  list: (params = {}) => get('/tags', params),
  getById: (id) => get(`/tags/${id}`),
  update: (id, body) => patch(`/tags/${id}`, body),
  delete: (id) => del(`/tags/${id}`),
  updateProductTags: (productId, body) => patch(`/tags/product/${productId}`, body),
  bulkUpdate: (body) => post('/tags/bulk-update', body),
};

/** Inventory batches */
export const inventoryBatchesApi = {
  create: (body) => post('/inventory-batches', body),
  list: (params = {}) => get('/inventory-batches', params),
  getById: (id) => get(`/inventory-batches/${id}`),
  update: (id, body) => patch(`/inventory-batches/${id}`, body),
  delete: (id) => del(`/inventory-batches/${id}`),
};

/** Related products */
export const relatedProductsApi = {
  create: (body) => post('/related-products', body),
  list: (productId, params = {}) => get(`/related-products/${productId}`, params),
  delete: (productId, relatedProductId) =>
    del(`/related-products/${productId}/${relatedProductId}`),
};

/** Product search */
export const searchApi = {
  products: (params = {}) => get('/search/products', params),
};

/** Coupons */
export const couponsApi = {
  create: (body) => post('/coupons', body),
  list: (params = {}) => get('/coupons', params),
  validate: (body) => post('/coupons/validate', body),
  getById: (id) => get(`/coupons/${id}`),
  update: (id, body) => patch(`/coupons/${id}`, body),
};

/** Invoices */
export const invoicesApi = {
  generate: (body) => post('/invoices/generate', body),
  list: (params = {}) => get('/invoices', params),
  byOrder: (orderId) => get(`/invoices/order/${orderId}`),
  byOrderHtml: (orderId) => get(`/invoices/order/${orderId}/html`),
  byNumber: (invoiceNumber) => get(`/invoices/number/${invoiceNumber}`),
};

/** Customers */
export const customersApi = {
  create: (body) => post('/customers', body),
  list: (params = {}) => get('/customers', params),
  getById: (id) => get(`/customers/${id}`),
  update: (id, body) => patch(`/customers/${id}`, body),
  delete: (id) => del(`/customers/${id}`),
};

/** Customer groups */
export const customerGroupsApi = {
  create: (body) => post('/customer-groups', body),
  list: (params = {}) => get('/customer-groups', params),
  getById: (id) => get(`/customer-groups/${id}`),
  update: (id, body) => patch(`/customer-groups/${id}`, body),
  delete: (id) => del(`/customer-groups/${id}`),
};

/** Customer addresses */
export const customerAddressesApi = {
  create: (body) => post('/customer-addresses', body),
  listByCustomer: (customerId) => get(`/customer-addresses/customer/${customerId}`),
  getById: (id) => get(`/customer-addresses/${id}`),
  update: (id, body) => patch(`/customer-addresses/${id}`, body),
  delete: (id) => del(`/customer-addresses/${id}`),
  setDefault: (customerId, id) =>
    post(`/customer-addresses/customer/${customerId}/default/${id}`, {}),
};

/** Quotes */
export const quotesApi = {
  create: (body) => post('/quotes', body),
  list: (params = {}) => get('/quotes', params),
  getById: (id) => get(`/quotes/${id}`),
  update: (id, body) => patch(`/quotes/${id}`, body),
  addLine: (id, body) => post(`/quotes/${id}/lines`, body),
  deleteLine: (quoteId, lineId) => del(`/quotes/${quoteId}/lines/${lineId}`),
  convertToOrder: (id) => post(`/quotes/${id}/convert-to-order`, {}),
};

/** Reviews */
export const reviewsApi = {
  create: (body) => post('/reviews', body),
  listByProduct: (productId, params = {}) =>
    get(`/reviews/product/${productId}`, params),
  updateByProduct: (productId, body) => patch(`/reviews/product/${productId}`, body),
  deleteByProduct: (productId) => del(`/reviews/product/${productId}`),
};

/** Wishlist */
export const wishlistApi = {
  add: (body) => post('/wishlist', body),
  list: (params = {}) => get('/wishlist', params),
  remove: (productId) => del(`/wishlist/${productId}`),
};

/** Price lists */
export const priceListsApi = {
  create: (body) => post('/price-lists', body),
  list: (params = {}) => get('/price-lists', params),
  getById: (id) => get(`/price-lists/${id}`),
  update: (id, body) => patch(`/price-lists/${id}`, body),
  delete: (id) => del(`/price-lists/${id}`),
  addItem: (id, body) => post(`/price-lists/${id}/items`, body),
};
