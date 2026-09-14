import { useAuth } from '@/auth/AuthContext'
import { AlertCircleIcon } from '@/components/Icons'

export function AccountDisabledPage() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
          <AlertCircleIcon className="h-8 w-8 text-error-600" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">Account Disabled</h1>
        <p className="mt-3 text-sm text-secondary-600">
          Your account has been deactivated. Please contact your administrator to
          restore access.
        </p>
        <button onClick={signOut} className="btn-secondary mt-8">
          Sign Out
        </button>
      </div>
    </div>
  )
}
