import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types.ts'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  const { data, error } = await supabase.auth.admin.deleteUser(user.id)
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting user',
      data: error,
    })
  }
  return data
})
