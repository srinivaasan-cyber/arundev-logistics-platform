import { useAuth } from '@/auth/AuthContext'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { DashboardIcon } from '@/components/Icons'

export function StaffDashboard() {
  const { profile, roles, user } = useAuth()

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'Team Member'

  const roleNames = roles.map((r) => r.name).join(', ') || 'No roles assigned'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Welcome, {displayName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-secondary-500">
          Arundev Logistics Staff Portal
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary-400">
          Your Access
        </h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between border-b border-secondary-100 pb-3">
            <span className="text-sm text-secondary-600">User Type</span>
            <span className="text-sm font-medium text-secondary-900">
              {profile?.user_type ?? '—'}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-secondary-100 pb-3">
            <span className="text-sm text-secondary-600">Roles</span>
            <span className="text-sm font-medium text-secondary-900">{roleNames}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Status</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-600">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              Active
            </span>
          </div>
        </div>
      </div>

      <PagePlaceholder
        title="Operations Dashboard"
        description="Operational overview and key metrics will appear here."
        icon={<DashboardIcon className="h-12 w-12" />}
      />
    </div>
  )
}
