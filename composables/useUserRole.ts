import { jwtDecode } from 'jwt-decode'
import { UserRoles } from '~/types/userRoles'

export const useUserRole = () => {
  const supabase = useSupabaseSession()
  const token = computed (() => supabase.value?.access_token)
  const role = computed(() => {
    if (!token.value) return undefined
    const decoded = jwtDecode(token.value) as {
      user_role: string | null
    }
    return decoded.user_role
  })

  const isAdmin = computed(() => role.value === UserRoles.Admin)
  return {
    isAdmin,
  }
}
