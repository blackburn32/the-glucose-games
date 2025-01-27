import type { GlucoseRecord } from '~/types/glucoseRecord.ts'
import { longestStreakWithoutHighs, longestStreakWithoutLows, longestStreakWithoutLowsOrHighs } from '~/utils/glucoseGames'
import { percentTimeInRangeForFullDayStreak, percentTimeInRangeForNightsStreak } from '~/utils/games/percentTimeInRange/percentTimeInRangeGames'
import { averageInRangeForFullDayStreak } from '~/utils/games/averageInRange/averangeInRangeGames'
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'

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

  const longestStreakWithoutLowsEver = computed(() => {
    return longestStreakWithoutLows(glucoseData.value, thresholds.value.low)
  })

  const longestStreakWithoutLowsInPrevious24Hours = computed(() => {
    return longestStreakWithoutLows(previous24Hours.value.glucoseValues, thresholds.value.low)
  })

  const longestStreakWithoutHighsEver = computed(() => {
    return longestStreakWithoutHighs(glucoseData.value, thresholds.value.high)
  })

  const longestStreakWithoutHighsInPrevious24Hours = computed(() => {
    return longestStreakWithoutHighs(previous24Hours.value.glucoseValues, thresholds.value.high)
  })

  const longestStreakWithoutLowsOrHighsEver = computed(() => {
    return longestStreakWithoutLowsOrHighs(glucoseData.value, thresholds.value.low, thresholds.value.high)
  })

  const longestStreakWithoutLowsOrHighsInPrevious24Hours = computed(() => {
    return longestStreakWithoutLowsOrHighs(previous24Hours.value.glucoseValues, thresholds.value.low, thresholds.value.high)
  })

  const createCurrentStreak = (streakFunction, ...args) => {
    return computed(() => {
      const streak = streakFunction(glucoseData.value, ...args, true)
      return {
        longestStreak: streak.longestStreak.length ? streak.longestStreak : mostRecentHour.value,
        streakString: streak.longestStreak.length ? streak.streakString : 'Out of range',
      }
    })
  }

  const currentStreakWithoutLows = createCurrentStreak(longestStreakWithoutLows, thresholds.value.low)
  const currentStreakWithoutHighs = createCurrentStreak(longestStreakWithoutHighs, thresholds.value.high)
  const currentStreakWithoutHighsOrLows = createCurrentStreak(longestStreakWithoutLowsOrHighs, thresholds.value.low, thresholds.value.high)

  return {
    averageInRangeForFullDay,
    currentStreakWithoutHighs,
    currentStreakWithoutHighsOrLows,
    currentStreakWithoutLows,
    glucoseData,
    longestStreakWithoutLowsEver,
    longestStreakWithoutHighsEver,
    longestStreakWithoutLowsOrHighsEver,
    longestStreakWithoutLowsInPrevious24Hours,
    longestStreakWithoutHighsInPrevious24Hours,
    longestStreakWithoutLowsOrHighsInPrevious24Hours,
    mostRecentHour,
    mostRecentResult,
    percentTimeInRangeForFullDay,
    percentTimeInRangeForNights,
    previous24Hours,
  }
}
