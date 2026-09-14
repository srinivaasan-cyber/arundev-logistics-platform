import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AuthState, AuthUser, Profile, Role, Permission } from '@/types/database'

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  hasRole: (roleName: string) => boolean
  hasPermission: (permissionName: string) => boolean
  isOwner: boolean
  isStaff: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const initialState: AuthState = {
  user: null,
  profile: null,
  roles: [],
  permissions: [],
  loading: true,
  error: null,
}

async function loadUserData(userId: string): Promise<{
  profile: Profile | null
  roles: Role[]
  permissions: Permission[]
}> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) throw profileError

  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)

  if (rolesError) throw rolesError

  let roles: Role[] = []
  let permissions: Permission[] = []

  if (userRoles && userRoles.length > 0) {
    const roleIds = userRoles.map((ur) => ur.role_id)

    const { data: rolesData, error: rolesDataError } = await supabase
      .from('roles')
      .select('*')
      .in('id', roleIds)

    if (rolesDataError) throw rolesDataError
    roles = rolesData || []

    const { data: rolePerms, error: rolePermsError } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .in('role_id', roleIds)

    if (rolePermsError) throw rolePermsError

    if (rolePerms && rolePerms.length > 0) {
      const permissionIds = [...new Set(rolePerms.map((rp) => rp.permission_id))]

      const { data: permsData, error: permsError } = await supabase
        .from('permissions')
        .select('*')
        .in('id', permissionIds)

      if (permsError) throw permsError
      permissions = permsData || []
    }
  }

  return { profile: profile as Profile | null, roles, permissions }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)

  const clearAuth = useCallback(() => {
    setState({
      user: null,
      profile: null,
      roles: [],
      permissions: [],
      loading: false,
      error: null,
    })
  }, [])

  const handleSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      clearAuth()
      return
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email ?? '',
      }

      const { profile, roles, permissions } = await loadUserData(session.user.id)

      setState({
        user: authUser,
        profile,
        roles,
        permissions,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState({
        user: {
          id: session.user.id,
          email: session.user.email ?? '',
        },
        profile: null,
        roles: [],
        permissions: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load user data',
      })
    }
  }, [clearAuth])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        await handleSession(session)
      })()
    })

    return () => subscription.unsubscribe()
  }, [handleSession])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign in failed' }
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    clearAuth()
  }, [clearAuth])

  const hasRole = useCallback(
    (roleName: string): boolean => state.roles.some((r) => r.name === roleName),
    [state.roles],
  )

  const hasPermission = useCallback(
    (permissionName: string): boolean => {
      if (state.roles.some((r) => r.name === 'OWNER')) return true
      return state.permissions.some((p) => p.name === permissionName)
    },
    [state.roles, state.permissions],
  )

  const isOwner = state.roles.some((r) => r.name === 'OWNER')
  const isStaff = state.profile?.user_type === 'STAFF'

  const value: AuthContextValue = {
    ...state,
    signIn,
    signOut,
    hasRole,
    hasPermission,
    isOwner,
    isStaff,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
