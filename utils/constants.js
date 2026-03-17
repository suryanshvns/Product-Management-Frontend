export const BRAND_NAME = 'InventoryHub';
export const BRAND_TAGLINE = 'Product Management & Analytics';

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  USERS: '/dashboard/users',
  USER_EDIT: id => `/dashboard/users/${id}`,
  PRODUCTS: '/dashboard/products',
  PRODUCT_NEW: '/dashboard/products/new',
  PRODUCT_EDIT: id => `/dashboard/products/${id}`,
  CATEGORIES: '/dashboard/categories',
  INVENTORY: '/dashboard/inventory',
  ANALYTICS: '/dashboard/analytics',
  ACTIVITY: '/dashboard/activity',
  ORDERS: '/dashboard/orders',
  ORGANIZATIONS: '/dashboard/organizations',
  LOGS: '/dashboard/logs',
  NOTIFICATIONS: '/dashboard/notifications',
  ALERT_RULES: '/dashboard/alert-rules',
  REPORTS: '/dashboard/reports',
  SETTINGS: '/dashboard/settings',
};

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/dashboard/products', icon: 'Package' },
  { label: 'Categories', href: '/dashboard/categories', icon: 'FolderTree' },
  { label: 'Orders', href: '/dashboard/orders', icon: 'ShoppingCart' },
  { label: 'Inventory', href: '/dashboard/inventory', icon: 'Warehouse' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: 'BarChart3' },
  { label: 'Reports', href: '/dashboard/reports', icon: 'FileText' },
  {
    label: 'Organizations',
    href: '/dashboard/organizations',
    icon: 'Building2',
  },
  { label: 'Logs', href: '/dashboard/logs', icon: 'ScrollText' },
  { label: 'Notifications', href: '/dashboard/notifications', icon: 'Bell' },
  {
    label: 'Alert Rules',
    href: '/dashboard/alert-rules',
    icon: 'AlertTriangle',
  },
  { label: 'Activity Logs', href: '/dashboard/activity', icon: 'Activity' },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: 'Users',
    requiredRoles: ['superadmin', 'admin'],
  },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  { label: 'Profile', href: '/dashboard/profile', icon: 'User' },
];

export const ROLE_NAMES = [
  'superadmin',
  'admin',
  'manager',
  'editor',
  'viewer',
  'support',
];

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];
