import { PagePlaceholder } from '@/components/PagePlaceholder'
import { TruckIcon } from '@/components/Icons'

export function DriverVehicle() {
  return (
    <PagePlaceholder
      title="My Vehicle"
      description="View your assigned vehicle and report maintenance issues."
      icon={<TruckIcon className="h-12 w-12" />}
    />
  )
}
