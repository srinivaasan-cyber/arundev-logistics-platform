import { Outlet } from 'react-router-dom'
import { AppShell, type NavSection } from '@/components/AppShell'
import {
  DashboardIcon,
  TruckIcon,
  UsersIcon,
  MapIcon,
  FileTextIcon,
  SettingsIcon,
} from '@/components/Icons'

const sections: NavSection[] = [
  {
    title: 'Operations',
    items: [
      { label: 'Dashboard', to: '/staff', icon: DashboardIcon },
      { label: 'Trips', to: '/staff/trips', icon: MapIcon },
    ],
  },
  {
    title: 'Fleet & Personnel',
    items: [
      { label: 'Vehicles', to: '/staff/vehicles', icon: TruckIcon },
      { label: 'Drivers', to: '/staff/drivers', icon: UsersIcon },
    ],
  },
  {
    title: 'Business',
    items: [
      { label: 'Customers', to: '/staff/customers', icon: UsersIcon },
      { label: 'Invoices', to: '/staff/invoices', icon: FileTextIcon },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Settings', to: '/staff/settings', icon: SettingsIcon },
    ],
  },
]

export function StaffLayout() {
  return (
    <AppShell sections={sections} portalLabel="Staff Portal">
      <Outlet />
    </AppShell>
  )
}
