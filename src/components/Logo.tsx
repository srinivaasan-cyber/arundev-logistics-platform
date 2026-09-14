interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7h13l4 5v5h-2" />
          <path d="M3 7v10h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      </div>
      {showText && (
        <div className="leading-tight">
          <div className="text-base font-bold tracking-tight text-secondary-900">Arundev</div>
          <div className="text-[10px] font-medium uppercase tracking-widest text-secondary-500">Logistics</div>
        </div>
      )}
    </div>
  )
}
