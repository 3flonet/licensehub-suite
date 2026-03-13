import { useState } from 'react'
import authService from '@services/authService'
import useStore from '@store/useStore'

/**
 * Hook for authentication operations
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { setAuth, logout: clearAuth, user, isAuthenticated, role } = useStore()

  const register = async (data) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authService.register(data)
      return response
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authService.login(email, password)

      // Save user and token to store
      setAuth(response.user, response.access_token, response.user.role)

      return response
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Login failed. Please try again.'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuth()
      setIsLoading(false)
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setIsLoading(true)
      setError(null)
      await authService.changePassword(oldPassword, newPassword)
      return { success: true }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to change password'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authService.updateProfile(data)
      setAuth(response.user, localStorage.getItem('auth_token'), response.user.role)
      return response
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to update profile'
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    user,
    isAuthenticated,
    role,
    isLoading,
    error,
    register,
    login,
    logout,
    changePassword,
    updateProfile,
    clearError,
  }
}

export default useAuth
