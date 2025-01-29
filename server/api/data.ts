import type { SupabaseClient } from '@supabase/supabase-js'
import type { RuntimeConfig } from '@nuxt/schema'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types.ts'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants.ts'
import { getToken } from '~/server/utils/database/getToken.ts'
import { getEstimatedBloodGlucoseValuesFromDexcom, refreshDexcomTokenIfNecessary } from '~/server/utils/dexcom/dexcomTokenTools.ts'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)
  const runtimeConfig = useRuntimeConfig(event)

  const egvsFromAllProviders = await Promise.all([
    getDexcomData(user.id, supabase, runtimeConfig),
  ])

  return egvsFromAllProviders.flat()
})

const getDexcomData = async (userId: string, supabase: SupabaseClient<Database>, runtimeConfig: RuntimeConfig) => {
  const dexcomBaseUrl = runtimeConfig.dexcomBaseUrl
  const dexcomClientId = runtimeConfig.dexcomClientId
  const dexcomClientSecret = runtimeConfig.dexcomClientSecret
  const token = await getToken(userId, DEXCOM_PROVIDER_NAME, supabase)
  if (!token) {
    console.trace('No token found for Dexcom')
    return []
  }

  await refreshDexcomTokenIfNecessary(userId, token, supabase, dexcomBaseUrl, dexcomClientId, dexcomClientSecret)

  const today = new Date()
  const monthAgo = new Date(today - 28 * 24 * 60 * 60 * 1000)

  return getEstimatedBloodGlucoseValuesFromDexcom(monthAgo, today, token, dexcomBaseUrl)
}
