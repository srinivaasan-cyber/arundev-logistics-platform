import { PagePlaceholder } from '@/components/PagePlaceholder'
import { FileTextIcon } from '@/components/Icons'

export function CustomerInvoices() {
  return (
    <PagePlaceholder
      title="My Invoices"
      description="View and download your invoices and payment history."
      icon={<FileTextIcon className="h-12 w-12" />}
    />
  )
}
