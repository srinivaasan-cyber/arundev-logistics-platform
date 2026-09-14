import type { ReactNode } from 'react'

interface PagePlaceholderProps {
  title: string
  description: string
  icon?: ReactNode
}

export function PagePlaceholder({ title, description, icon }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
        <p className="mt-1 text-sm text-secondary-500">{description}</p>
      </div>
      <div className="card flex min-h-[400px] flex-col items-center justify-center gap-4 p-12">
        {icon && <div className="text-secondary-300">{icon}</div>}
        <p className="text-sm font-medium text-secondary-400">
          This module will be built in a future milestone.
        </p>
        <p className="max-w-sm text-center text-xs text-secondary-400">
          The authentication, authorization, and routing foundation is in place.
          Operational modules will be added incrementally.
        </p>
      </div>
    </div>
  )
}
