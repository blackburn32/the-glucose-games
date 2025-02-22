import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const setNightscoutSettings = async (user_id: string, base_url: string, token: string, client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from('nightscout_settings')
    .upsert({ user_id, base_url, token })
    .single()

  if (error) {
    console.error('Failed to set nightscout settings', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to set nightscout settings: ${error.message}`,
    })
  }

  return data
}
