export const BRAND_NAME = 'InventoryHub';
export const BRAND_TAGLINE = 'Product Management & Analytics';

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  USERS: '/dashboard/users',
  USER_EDIT: (id) => `/dashboard/users/${id}`,
  PRODUCTS: '/dashboard/products',
  CATEGORIES: '/dashboard/categories',
  TAGS: '/dashboard/tags',
  PRODUCT_VARIANTS: '/dashboard/product-variants',
  INVENTORY_BATCHES: '/dashboard/inventory-batches',
  RELATED_PRODUCTS: '/dashboard/related-products',
  SEARCH: '/dashboard/search',
  ORDERS: '/dashboard/orders',
  COUPONS: '/dashboard/coupons',
  INVOICES: '/dashboard/invoices',
  CUSTOMERS: '/dashboard/customers',
  CUSTOMER_GROUPS: '/dashboard/customer-groups',
  CUSTOMER_ADDRESSES: '/dashboard/customer-addresses',
  QUOTES: '/dashboard/quotes',
  REVIEWS: '/dashboard/reviews',
  WISHLIST: '/dashboard/wishlist',
  PRICE_LISTS: '/dashboard/price-lists',
  INVENTORY: '/dashboard/inventory',
  ANALYTICS: '/dashboard/analytics',
  REPORTS: '/dashboard/reports',
  LOGS: '/dashboard/logs',
  NOTIFICATIONS: '/dashboard/notifications',
  SETTINGS: '/dashboard/settings',
};

/**
 * Collapsible sidebar groups (no separate "Main" / "More").
 * Removed: Organizations, Alert Rules, Activity (redundant with Logs).
 */
export const SIDEBAR_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    defaultOpen: true,
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'Analytics', href: '/dashboard/analytics', icon: 'BarChart3' },
      { label: 'Reports', href: '/dashboard/reports', icon: 'FileText' },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    defaultOpen: true,
    items: [
      { label: 'Products', href: '/dashboard/products', icon: 'Package' },
      { label: 'Categories', href: '/dashboard/categories', icon: 'FolderTree' },
      { label: 'Tags', href: '/dashboard/tags', icon: 'Tag' },
      { label: 'Variants', href: '/dashboard/product-variants', icon: 'Layers' },
      { label: 'Search', href: '/dashboard/search', icon: 'Search' },
      { label: 'Related', href: '/dashboard/related-products', icon: 'Link2' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    items: [
      { label: 'Stock overview', href: '/dashboard/inventory', icon: 'Warehouse' },
      { label: 'Batches', href: '/dashboard/inventory-batches', icon: 'Boxes' },
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    items: [
      { label: 'Orders', href: '/dashboard/orders', icon: 'ShoppingCart' },
      { label: 'Quotes', href: '/dashboard/quotes', icon: 'FileSpreadsheet' },
      { label: 'Invoices', href: '/dashboard/invoices', icon: 'Receipt' },
      { label: 'Coupons', href: '/dashboard/coupons', icon: 'Ticket' },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    items: [
      { label: 'Customers', href: '/dashboard/customers', icon: 'Contact' },
      { label: 'Groups', href: '/dashboard/customer-groups', icon: 'UsersRound' },
      { label: 'Addresses', href: '/dashboard/customer-addresses', icon: 'MapPin' },
    ],
  },
  {
    id: 'marketing',
    label: 'Engagement',
    items: [
      { label: 'Reviews', href: '/dashboard/reviews', icon: 'Star' },
      { label: 'Wishlist', href: '/dashboard/wishlist', icon: 'Heart' },
      { label: 'Price lists', href: '/dashboard/price-lists', icon: 'ListOrdered' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { label: 'Logs', href: '/dashboard/logs', icon: 'ScrollText' },
      { label: 'Notifications', href: '/dashboard/notifications', icon: 'Bell' },
      {
        label: 'Users',
        href: '/dashboard/users',
        icon: 'Users',
        requiredRoles: ['superadmin', 'admin'],
      },
      { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
      { label: 'Profile', href: '/dashboard/profile', icon: 'User' },
    ],
  },
];

/** Flat list for collapsed sidebar / lookups */
export function getAllSidebarItems() {
  return SIDEBAR_GROUPS.flatMap((g) => g.items);
}

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
