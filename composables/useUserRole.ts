import { jwtDecode } from 'jwt-decode'
import { UserRoles } from '~/types/userRoles'

export const useUserRole = () => {
  const supabase = useSupabaseSession()
  const token = computed (() => supabase.value?.access_token)
  const role = computed(() => {
    if (!token.value) return undefined
    const decoded = jwtDecode(token.value)
    return decoded['user_role'] as string | null
  })

  const isAdmin = computed(() => role.value === UserRoles.Admin)
  return {
    isAdmin,
  }
}
