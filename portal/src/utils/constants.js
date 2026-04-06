/**
 * App constants and configuration
 */

export const APP_NAME = 'LicenseHub'

export const ROUTES = {
  // Public
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  FEATURES: '/features',
  COMPARE_PLANS: '/compare-plans',
  FAQ: '/faq',
  DOCS: '/docs',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRM: '/order-confirmation/:orderId',
  CONTACT: '/contact',
  COOKIES: '/cookies',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  NOT_FOUND: '*',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Portal (Protected)
  PORTAL_HOME: '/portal',
  PORTAL_DASHBOARD: '/portal/dashboard',
  PORTAL_LICENSES: '/portal/licenses',
  PORTAL_LICENSE_DETAIL: '/portal/licenses/:id',
  PORTAL_ACTIVATE: '/portal/activate',
  PORTAL_ACTIVATIONS: '/portal/activations',
  PORTAL_PROFILE: '/portal/profile',
  PORTAL_BILLING: '/portal/billing',
  PORTAL_SUPPORT: '/portal/support',

  // Admin (Protected)
  ADMIN_HOME: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_CREATE: '/admin/products/create',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: '/admin/orders/:id',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_LICENSES: '/admin/licenses',
  ADMIN_REPORTS: '/admin/reports',
}

export const LICENSE_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
  REVOKED: 'revoked',
}

export const LICENSE_STATUS_LABELS = {
  pending: 'Pending',
  active: 'Active',
  expired: 'Expired',
  suspended: 'Suspended',
  revoked: 'Revoked',
}

export const LICENSE_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  suspended: 'bg-orange-100 text-orange-800',
  revoked: 'bg-red-100 text-red-800',
}

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
}

export const PAYMENT_METHODS = {
  MIDTRANS: 'midtrans',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  TABLE_PER_PAGE: 20,
}

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  NOT_FOUND: 'The requested resource was not found',
}
