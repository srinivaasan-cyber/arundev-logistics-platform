import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { UserType, StaffRoleName } from '@/types/database'
import { FullScreenLoader } from '@/components/FullScreenLoader'

interface ProtectedRouteProps {
  children: ReactNode
  allowedUserTypes?: UserType[]
  allowedRoles?: StaffRoleName[]
}

export function ProtectedRoute({
  children,
  allowedUserTypes,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, profile, roles, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <FullScreenLoader />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (profile && !profile.is_active) {
    return <Navigate to="/account-disabled" replace />
  }

  if (allowedUserTypes && profile) {
    if (!allowedUserTypes.includes(profile.user_type)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  if (allowedRoles && roles.length > 0) {
    const hasAllowedRole = roles.some((r) => allowedRoles.includes(r.name))
    const isOwner = roles.some((r) => r.name === 'OWNER')
    if (!hasAllowedRole && !isOwner) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <>{children}</>
}
