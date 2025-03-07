import type { GlucoseRecord } from '~/types/glucoseRecord.ts'
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import type { Thresholds } from '~/types/thresholds'
import { getScoredGames } from '~/utils/games/scoredGames'
import { NIGHTSCOUT_PROVIDER_NAME } from '~/types/constants'
import { cleanPercentForDisplay } from '~/utils/formatting/percentFormatting'

export const useGlucoseValues = (dataOverride?: Ref<GlucoseRecord[]> | undefined, thresholdsOverride?: Thresholds | undefined) => {
  const glucoseDataRaw = useFetch<GlucoseRecord[]>('/api/data', {
    key: 'glucoseData',
    default: () => [],
    lazy: true,
    retry: 3,
  })

  const { hasDexcom } = useTokenStatus()
  watch(hasDexcom, () => {
    glucoseDataRaw.refresh()
  })

  const { hasNightscout, nightscoutSettings } = useNightscout()
  watch(hasNightscout, () => {
    glucoseDataRaw.refresh()
  })
  watch(nightscoutSettings, () => {
    glucoseDataRaw.refresh()
  })

  const user = useSupabaseUser()
  watch(user, () => {
    glucoseDataRaw.refresh()
  })

  const glucoseDataLoading = computed(() => {
    if (dataOverride?.value.length) return false
    return glucoseDataRaw.status.value === 'pending'
  })

  const glucoseData: Ref<GlucoseRecord[]> = computed(() => {
    if (dataOverride?.value.length) return dataOverride.value
    return glucoseDataRaw.data.value.map(record => ({
      ...record,
      created: new Date(record.created),
    })).sort((a, b) => a.created.getTime() - b.created.getTime())
  })

  const hasGlucoseData = computed(() => {
    return glucoseData.value.length > 0
  })

  const hasNightscoutData = computed(() => {
    return glucoseData.value.some(record => record.provider === NIGHTSCOUT_PROVIDER_NAME)
  })

  const { thresholds } = useThresholds()
  const thresholdsToUse = computed(() => thresholdsOverride || thresholds.value)

  const scoredGames = computed(() => getScoredGames(glucoseData.value, thresholdsToUse.value))

  const mostRecentResult = computed(() => glucoseData.value.at(-1))

  const mostRecentHour: Ref<GlucoseRecord[]> = computed(() => {
    if (!mostRecentResult.value) return []
    const hourBefore = mostRecentResult.value.created.getTime() - 60 * 60 * 1000
    return glucoseData.value.filter(record => record?.created.getTime() > hourBefore)
  })

  const previous24Hours = computed(() => {
    const today = Date.now()
    const dayAgo = new Date(today - 24 * 60 * 60 * 1000)
    const glucoseValues = glucoseData.value.filter(record => record.created > dayAgo)
    const percentTimeInRange = glucoseValues.length > 0 ? scoreRecordsByPercentTimeInRange(glucoseValues, thresholdsToUse.value) : undefined
    const cleanPercentTimeInRange = percentTimeInRange ? cleanPercentForDisplay(percentTimeInRange) : 'Unknown'
    return {
      glucoseValues,
      percentTimeInRange,
      cleanPercentTimeInRange,
    }
  })

  const refreshGlucoseData = () => {
    return glucoseDataRaw.refresh()
  }

  const mostRecentRecordWithinLastHour = computed(() => {
    const now = Date.now()
    const hourAgo = now - 60 * 60 * 1000
    const hourOfRecords = glucoseData.value.filter(record => record.created.getTime() > hourAgo)
    return hourOfRecords.at(-1)
  })

  return {
    glucoseData,
    glucoseDataLoading,
    hasGlucoseData,
    hasNightscoutData,
    mostRecentHour,
    mostRecentRecordWithinLastHour,
    mostRecentResult,
    previous24Hours,
    refreshGlucoseData,
    scoredGames,
  }
}
