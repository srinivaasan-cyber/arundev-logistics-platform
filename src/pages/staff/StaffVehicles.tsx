import { PagePlaceholder } from '@/components/PagePlaceholder'
import { TruckIcon } from '@/components/Icons'

export function StaffVehicles() {
  return (
    <PagePlaceholder
      title="Fleet Management"
      description="Manage vehicles, maintenance schedules, and fleet status."
      icon={<TruckIcon className="h-12 w-12" />}
    />
  )
}
