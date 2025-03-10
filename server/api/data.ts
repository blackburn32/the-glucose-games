import type { SupabaseClient } from '@supabase/supabase-js'
import type { RuntimeConfig } from '@nuxt/schema'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types.ts'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'
import { getToken } from '~/server/utils/database/oauthTokens/getToken/getToken'
import { getEstimatedBloodGlucoseValuesFromDexcom, refreshDexcomTokenIfNecessary } from '~/server/utils/dexcom/dexcomTokenTools'
import { getNightscoutEGVs } from '~/server/utils/nightscout/nightscoutTools'
import { getNightscoutSettings } from '~/server/utils/database/nightscoutSettings/getNightscoutSettings/getNightscoutSettings'

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
    getNightscoutData(user.id, supabase),
  ])

  return egvsFromAllProviders.flat()
})

const getNightscoutData = async (userId: string, supabase: SupabaseClient<Database>) => {
  const nightscoutSettings = await getNightscoutSettings(userId, supabase)
  if (!nightscoutSettings) {
    console.trace('No Nightscout settings found')
    return []
  }
  const count = 100000
  return getNightscoutEGVs(nightscoutSettings.base_url, nightscoutSettings.token, count)
}

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
  const monthAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)

  return getEstimatedBloodGlucoseValuesFromDexcom(monthAgo, today, token, dexcomBaseUrl)
}
