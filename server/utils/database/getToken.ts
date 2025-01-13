import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types.ts'

export const getToken = async (user_id: string, provider: string, client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('oauth_tokens').select('*').eq('user_id', user_id).eq('provider', provider).maybeSingle()
  if (error) {
    console.log('Failed to get token', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get token',
    })
  }
  return data
}
