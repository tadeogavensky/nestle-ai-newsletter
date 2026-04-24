// utils/role-label.ts
// Devuelve el label legible para un rol de usuario
import type { UserRole } from '../contexts/AuthContext'

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'super-admin':
      return 'Super admin'
    case 'revisor':
      return 'Revisor'
    case 'user':
      return 'Usuario normal'
    default:
      return role
  }
}
