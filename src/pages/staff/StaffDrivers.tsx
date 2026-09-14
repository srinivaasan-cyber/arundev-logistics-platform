import { PagePlaceholder } from '@/components/PagePlaceholder'
import { UsersIcon } from '@/components/Icons'

export function StaffDrivers() {
  return (
    <PagePlaceholder
      title="Driver Management"
      description="Manage driver profiles, assignments, and compliance."
      icon={<UsersIcon className="h-12 w-12" />}
    />
  )
}
