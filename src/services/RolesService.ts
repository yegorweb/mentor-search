export default {
  getIdFromRole(role: string): string {
    return role.split('-')[2]
  },

  getSchoolIdsFromRoles(roles: string[]): string[] {
    return roles
      .filter(item => item.includes('school-admin-'))
      .map(item => item.split('school-admin-')[1])
  },

  getSchoolIdFromRole(role: string): string {
    return role.split('school-admin-')[1]
  },

  getTownIdsFromRoles(roles: string[]): string[] {
    return roles
      .filter(item => item.includes('town-admin-'))
      .map(item => item.split('town-admin-')[1])
  },

  getTownIdFromRole(role: string): string {
    return role.split('town-admin-')[1]
  },

  isAdminOfSchool(roles: string[], school_id: string): boolean {
    return roles.includes(`school-admin-${school_id}`)
  },

  isAdminOfTown(roles: string[], town_id: string): boolean {
    return roles.includes(`town-admin-${town_id}`)
  },

  getRolesWithSchool(roles: string[], school_id: string): string[] {
    roles.push(`school-admin-${school_id}`)
    return roles
  },

  getRolesWithTown(roles: string[], town_id: string): string[] {
    roles.push(`town-admin-${town_id}`)
    return roles
  },

  getRolesWithoutSchool(roles: string[], school_id: string): string[] {
    return roles.filter(item => !item.includes(`school-admin-${school_id}`))
  },

  getRolesWithoutTown(roles: string[], town_id: string): string[] {
    return roles.filter(item => !item.includes(`town-admin-${town_id}`))
  },

  isSomeAdmin(roles: string[]): boolean {
    return roles.some(item => item.split('-')[1] === 'admin')
  },

  isGlobalAdmin(roles: string[]): boolean {
    return roles.includes('global-admin')
  },

  isTownAdmin(roles: string[]): boolean {
    return roles.some(item => item.split('-')[0] === 'town')
  },

  isSchoolAdmin(roles: string[]): boolean {
    return roles.some(item => item.split('-')[0] === 'school')
  },

  isMentor(roles: string[]): boolean {
    return roles.includes('mentor')
  },

  getType(roles: string[]): string {
    if (this.isSomeAdmin(roles))
      return 'админ'
      
    if (this.isMentor(roles))
      return 'наставник'
      
    return 'наставляемый'
  },
}
