import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Logo } from './Logo'
import {
  MenuIcon,
  CloseIcon,
  LogOutIcon,
  UserIcon,
  type IconComponent,
} from './Icons'

export interface NavItem {
  label: string
  to: string
  icon: IconComponent
}

export interface NavSection {
  title: string
  items: NavItem[]
}

interface AppShellProps {
  sections: NavSection[]
  portalLabel: string
  children: ReactNode
}

export function AppShell({ sections, portalLabel, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'User'

  return (
    <div className="flex min-h-screen bg-secondary-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-secondary-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-secondary-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-secondary-200 px-4">
          <Logo />
          <button
            className="btn-ghost p-2 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 py-2">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-secondary-400">
            {portalLabel}
          </p>
          <nav className="space-y-1">
            {sections.map((section) => (
              <div key={section.title} className="space-y-1">
                <p className="px-3 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-secondary-400">
                  {section.title}
                </p>
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                      }`
                    }
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-secondary-200 bg-white/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              className="btn-ghost p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-secondary-700">{portalLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-medium text-secondary-800">{displayName}</div>
                {profile?.user_type && (
                  <div className="text-[11px] text-secondary-500">
                    {profile.user_type.replace('_', ' ')}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-ghost p-2"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOutIcon className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
