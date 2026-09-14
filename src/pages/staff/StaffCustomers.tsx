import { PagePlaceholder } from '@/components/PagePlaceholder'
import { UsersIcon } from '@/components/Icons'

export function StaffCustomers() {
  return (
    <PagePlaceholder
      title="Customer Management"
      description="Manage customer accounts, contracts, and relationships."
      icon={<UsersIcon className="h-12 w-12" />}
    />
  )
}
