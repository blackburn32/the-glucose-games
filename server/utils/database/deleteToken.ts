import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types.ts'

export const deleteToken = async (user_id: string, provider: string, client: SupabaseClient<Database>) => {
  const { error } = await client.from('oauth_tokens').delete().eq('user_id', user_id).eq('provider', provider)
  if (error) {
    console.log('Failed to delete token', error)
    // throw createError({
    //   statusCode: 500,
    //   statusMessage: 'Failed to delete token',
    // })
  }
}
