import apiClient from '@config/api'

/**
 * Auth Service - handles all authentication operations
 */
const authService = {
  /**
   * Register a new customer
   */
  register: async (data) => {
    const response = await apiClient.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirm,
      phone: data.phone || null,
      company: data.company || null,
    })
    return response.data
  },

  /**
   * Login customer
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  /**
   * Logout customer
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  /**
   * Get current user info
   */
  getMe: async () => {
    const response = await apiClient.get('/me')
    return response.data
  },

  /**
   * Update user profile
   */
  updateProfile: async (data) => {
    const response = await apiClient.patch('/me', data)
    return response.data
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.post('/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    })
    return response.data
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/forgot-password', { email })
    return response.data
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, email, password) => {
    const response = await apiClient.post('/reset-password', {
      token,
      email,
      password,
      password_confirmation: password,
    })
    return response.data
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    const response = await apiClient.post('/verify-email', { token })
    return response.data
  },
}

export default authService
