import type { SupabaseClient } from '@supabase/supabase-js'
import { getNightscoutSettings } from '../database/nightscoutSettings/getNightscoutSettings/getNightscoutSettings'
import { pageThroughNightscoutEGVs } from '../nightscout/nightscoutTools'
import { ONE_MONTH } from '~/types/constants'
import type { Database } from '~/types/database.types'

export class DataManager {
  constructor(
    private readonly userId: string,
    private readonly supabase: SupabaseClient<Database>,
  ) {
  }

  public async getNightscoutData(start: Date | undefined = undefined, end: Date | undefined = undefined) {
    const nightscoutSettings = await getNightscoutSettings(this.userId, this.supabase)
    if (!nightscoutSettings) {
      console.trace('No Nightscout settings found')
      return []
    }
    const endDateToUse = end ?? new Date()
    const startDateToUse = start ?? new Date(endDateToUse.getTime() - ONE_MONTH)
    const count = 1000
    return pageThroughNightscoutEGVs(nightscoutSettings.base_url, nightscoutSettings.token, count, startDateToUse, endDateToUse)
  }
}
