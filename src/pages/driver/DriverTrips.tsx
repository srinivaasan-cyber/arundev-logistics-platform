import { PagePlaceholder } from '@/components/PagePlaceholder'
import { MapIcon } from '@/components/Icons'

export function DriverTrips() {
  return (
    <PagePlaceholder
      title="My Trips"
      description="View and manage your assigned trips."
      icon={<MapIcon className="h-12 w-12" />}
    />
  )
}
