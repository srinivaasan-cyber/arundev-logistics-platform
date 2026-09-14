export type UserType = 'CUSTOMER' | 'DRIVER' | 'PARTNER' | 'STAFF'

export type StaffRoleName =
  | 'OWNER'
  | 'ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'DISPATCHER'
  | 'FLEET_MANAGER'
  | 'FINANCE'
  | 'SALES'

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'manage'

export interface Profile {
  id: string
  user_type: UserType
  first_name: string | null
  last_name: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: StaffRoleName
  description: string | null
  is_system: boolean
  created_at: string
}

export interface Permission {
  id: string
  name: string
  description: string | null
  resource: string
  action: PermissionAction
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  assigned_at: string
}

export interface RolePermission {
  id: string
  role_id: string
  permission_id: string
}

export interface AuthUser {
  id: string
  email: string
}

export interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  roles: Role[]
  permissions: Permission[]
  loading: boolean
  error: string | null
}
