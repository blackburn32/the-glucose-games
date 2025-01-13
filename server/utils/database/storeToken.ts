import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types.ts'
import { deleteToken } from '~/server/utils/database/deleteToken.ts'

export const storeToken = async (tokenData: Database['public']['Tables']['oauth_tokens']['Insert'], client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('oauth_tokens').insert(tokenData)
  if (error) {
    console.log('Failed to store token', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to store token',
    })
  }
  return data
}

export const safeStoreToken = async (tokenData: Database['public']['Tables']['oauth_tokens']['Insert'], client: SupabaseClient<Database>) => {
  await deleteToken(tokenData.user_id, tokenData.provider, client)
  return storeToken(tokenData, client)
}
