export const roles_array = ['global-admin', 'school-admin', 'student', 'mentor'] as const

export type Role = typeof roles_array[number]
export type Roles = Role[]