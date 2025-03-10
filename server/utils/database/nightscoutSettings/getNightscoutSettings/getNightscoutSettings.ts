import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const getNightscoutSettings = async (user_id: string, client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from('nightscout_settings')
    .select('*')
    .eq('user_id', user_id)
    .maybeSingle()

  if (error) {
    console.error('Failed to get nightscout settings', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to get nightscout settings: ${error.message}`,
    })
  }

  return data
}
