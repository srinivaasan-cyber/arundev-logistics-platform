import { PagePlaceholder } from '@/components/PagePlaceholder'
import { MapIcon } from '@/components/Icons'

export function StaffTrips() {
  return (
    <PagePlaceholder
      title="Trip Management"
      description="Plan, dispatch, and track trips across the network."
      icon={<MapIcon className="h-12 w-12" />}
    />
  )
}
