import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { ShieldIcon } from '@/components/Icons'

export function UnauthorizedPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning-100">
          <ShieldIcon className="h-8 w-8 text-warning-600" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">Access Restricted</h1>
        <p className="mt-3 text-sm text-secondary-600">
          You don't have permission to access this area. If you believe this is an error,
          please contact your administrator.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          {user ? (
            <button onClick={signOut} className="btn-secondary">
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              Back to Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
