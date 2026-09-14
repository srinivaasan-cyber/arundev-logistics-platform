import { PagePlaceholder } from '@/components/PagePlaceholder'
import { SettingsIcon } from '@/components/Icons'

export function StaffSettings() {
  return (
    <PagePlaceholder
      title="Platform Settings"
      description="Configure platform-wide settings, roles, and permissions."
      icon={<SettingsIcon className="h-12 w-12" />}
    />
  )
}
