import { Outlet } from 'react-router-dom'
import { AppShell, type NavSection } from '@/components/AppShell'
import {
  DashboardIcon,
  MapIcon,
  TruckIcon,
} from '@/components/Icons'

const sections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', to: '/driver', icon: DashboardIcon },
      { label: 'My Trips', to: '/driver/trips', icon: MapIcon },
      { label: 'My Vehicle', to: '/driver/vehicle', icon: TruckIcon },
    ],
  },
]

export function DriverLayout() {
  return (
    <AppShell sections={sections} portalLabel="Driver Portal">
      <Outlet />
    </AppShell>
  )
}
