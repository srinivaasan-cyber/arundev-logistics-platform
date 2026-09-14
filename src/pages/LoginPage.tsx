import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Logo } from '@/components/Logo'
import { AlertCircleIcon } from '@/components/Icons'
import type { UserType } from '@/types/database'

interface LocationState {
  from?: { pathname?: string }
}

export function LoginPage() {
  const { signIn, user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && profile) {
    const from = (location.state as LocationState)?.from?.pathname
    const dest = from ?? getPortalHome(profile.user_type)
    navigate(dest, { replace: true })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: signInError } = await signIn(email.trim(), password)
    if (signInError) {
      setError(signInError)
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo showText className="scale-125" />
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-secondary-900">Sign In</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Arundev Logistics Integrated Logistics Operating Platform
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-secondary-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@arundev.com"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-secondary-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                disabled={submitting}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-error-50 px-3 py-2.5 text-sm text-error-700">
                <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-secondary-400">
          Access is restricted to authorized users of Arundev Logistics.
        </p>
      </div>
    </div>
  )
}

function getPortalHome(userType: UserType): string {
  switch (userType) {
    case 'STAFF':
      return '/staff'
    case 'DRIVER':
      return '/driver'
    case 'CUSTOMER':
      return '/customer'
    case 'PARTNER':
      return '/customer'
    default:
      return '/unauthorized'
  }
}
