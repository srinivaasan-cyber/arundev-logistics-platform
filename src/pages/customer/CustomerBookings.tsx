import { PagePlaceholder } from '@/components/PagePlaceholder'
import { PackageIcon } from '@/components/Icons'

export function CustomerBookings() {
  return (
    <PagePlaceholder
      title="My Shipments"
      description="View and track your current and past shipments."
      icon={<PackageIcon className="h-12 w-12" />}
    />
  )
}
