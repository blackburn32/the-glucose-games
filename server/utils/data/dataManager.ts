import type { SupabaseClient } from '@supabase/supabase-js'
import type { RuntimeConfig } from 'nuxt/schema'
import { getNightscoutSettings } from '../database/nightscoutSettings/getNightscoutSettings/getNightscoutSettings'
import { getNightscoutEGVs } from '../nightscout/nightscoutTools'
import { refreshDexcomTokenIfNecessary, getEstimatedBloodGlucoseValuesFromDexcom } from '../dexcom/dexcomTokenTools'

import { getToken } from '../database/oauthTokens/getToken/getToken'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'
import type { Database } from '~/types/database.types'

export class DataManager {
  constructor(
    private readonly userId: string,
    private readonly supabase: SupabaseClient<Database>,
    private readonly runtimeConfig: RuntimeConfig,
  ) {
  }

  public async getNightscoutData() {
    const nightscoutSettings = await getNightscoutSettings(this.userId, this.supabase)
    if (!nightscoutSettings) {
      console.trace('No Nightscout settings found')
      return []
    }
    const count = 100000
    return getNightscoutEGVs(nightscoutSettings.base_url, nightscoutSettings.token, count)
  }

  public async getDexcomData() {
    const dexcomBaseUrl = this.runtimeConfig.dexcomBaseUrl
    const dexcomClientId = this.runtimeConfig.dexcomClientId
    const dexcomClientSecret = this.runtimeConfig.dexcomClientSecret
    const token = await getToken(this.userId, DEXCOM_PROVIDER_NAME, this.supabase)
    if (!token) {
      console.trace('No token found for Dexcom')
      return []
    }

    await refreshDexcomTokenIfNecessary(this.userId, token, this.supabase, dexcomBaseUrl, dexcomClientId, dexcomClientSecret)

    const today = new Date()
    const monthAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)

    return getEstimatedBloodGlucoseValuesFromDexcom(monthAgo, today, token, dexcomBaseUrl)
  }
}
