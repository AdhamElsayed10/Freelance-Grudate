import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to the correct dashboard based on their actual role
    const dashboards = { user: '/dashboard/user', company: '/dashboard/company', admin: '/dashboard/admin' }
    return <Navigate to={dashboards[role] || '/'} replace />
  }

  return children
}
