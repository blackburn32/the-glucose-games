import type { GlucoseRecord } from '~/types/glucoseRecord.ts'
import { percentTimeInRangeForFullDayStreak, percentTimeInRangeForNightsStreak } from '~/utils/games/percentTimeInRange/percentTimeInRangeGames'
import { averageInRangeForFullDayStreak } from '~/utils/games/averageInRange/averangeInRangeGames'
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import { contiguousStreakWithNoHighs, contiguousStreakWithNoLows, contiguousStreakWithNoLowsOrHighs } from '~/utils/games/contiguousStreak/contiguousStreakGames'

export const useGlucoseValues = (dataOverride?: Ref<GlucoseRecord[]> | undefined) => {
  const glucoseDataRaw = useFetch<GlucoseRecord[]>('/api/data', {
    key: 'glucoseData',
    default: () => [],
    immediate: true,
  })

  const glucoseData: Ref<GlucoseRecord[]> = computed(() => {
    if (dataOverride?.value.length) return dataOverride.value
    return glucoseDataRaw.data.value.map(record => ({
      ...record,
      created: new Date(record.created),
    })).sort((a, b) => a.created.getTime() - b.created.getTime())
  })

  const thresholds = useThresholds()

  const percentTimeInRangeForFullDay = computed(() => {
    return percentTimeInRangeForFullDayStreak(glucoseData.value, thresholds.value, 80)
  })

  const percentTimeInRangeForNights = computed(() => {
    return percentTimeInRangeForNightsStreak(glucoseData.value, thresholds.value, 80)
  })

  const averageInRangeForFullDay = computed(() => {
    return averageInRangeForFullDayStreak(glucoseData.value, thresholds.value)
  })

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
    const percentTimeInRange = scoreRecordsByPercentTimeInRange(glucoseValues, thresholds.value)
    const cleanPercentTimeInRange = cleanPercentForDisplay(percentTimeInRange)
    return {
      glucoseValues,
      percentTimeInRange,
      cleanPercentTimeInRange,
    }
  })

  const noLowsStreaks = computed(() => {
    return contiguousStreakWithNoLows(glucoseData.value, thresholds.value)
  })

  const noHighsStreaks = computed(() => {
    return contiguousStreakWithNoHighs(glucoseData.value, thresholds.value)
  })

  const noHighsOrLowsStreaks = computed(() => {
    return contiguousStreakWithNoLowsOrHighs(glucoseData.value, thresholds.value)
  })

  return {
    averageInRangeForFullDay,
    glucoseData,
    mostRecentHour,
    mostRecentResult,
    noHighsStreaks,
    noHighsOrLowsStreaks,
    noLowsStreaks,
    percentTimeInRangeForFullDay,
    percentTimeInRangeForNights,
    previous24Hours,
  }
}
