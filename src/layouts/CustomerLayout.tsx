import { Outlet } from 'react-router-dom'
import { AppShell, type NavSection } from '@/components/AppShell'
import {
  DashboardIcon,
  PackageIcon,
  FileTextIcon,
} from '@/components/Icons'

const sections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', to: '/customer', icon: DashboardIcon },
      { label: 'My Shipments', to: '/customer/shipments', icon: PackageIcon },
      { label: 'My Invoices', to: '/customer/invoices', icon: FileTextIcon },
    ],
  },
]

export function CustomerLayout() {
  return (
    <AppShell sections={sections} portalLabel="Customer Portal">
      <Outlet />
    </AppShell>
  )
}
