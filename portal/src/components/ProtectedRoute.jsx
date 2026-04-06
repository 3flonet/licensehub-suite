import { Navigate } from 'react-router-dom'
import useStore from '@store/useStore'

/**
 * Protected Route Component
 * Redirects unauthenticated users to login
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, role } = useStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
