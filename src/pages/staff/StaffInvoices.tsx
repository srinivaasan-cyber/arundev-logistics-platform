import { PagePlaceholder } from '@/components/PagePlaceholder'
import { FileTextIcon } from '@/components/Icons'

export function StaffInvoices() {
  return (
    <PagePlaceholder
      title="Invoicing"
      description="Manage invoices, payments, and financial records."
      icon={<FileTextIcon className="h-12 w-12" />}
    />
  )
}
