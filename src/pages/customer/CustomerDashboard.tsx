import { useAuth } from '@/auth/AuthContext'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { DashboardIcon } from '@/components/Icons'

export function CustomerDashboard() {
  const { profile, user } = useAuth()
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'Customer'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Welcome, {displayName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-secondary-500">Arundev Logistics Customer Portal</p>
      </div>
      <PagePlaceholder
        title="Your Dashboard"
        description="Track shipments, view quotes, and manage your account."
        icon={<DashboardIcon className="h-12 w-12" />}
      />
    </div>
  )
}
