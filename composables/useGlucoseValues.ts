import type { GlucoseRecord } from '~/types/types.ts'
import { longestStreakWithoutHighs, longestStreakWithoutLows, longestStreakWithoutLowsOrHighs } from '~/utils/glucoseGames.ts'

export const useGlucoseValues = () => {
  const glucoseData = useFetch<GlucoseRecord[]>('/api/data', {
    key: 'glucoseData',
    default: () => [],
  })

  const mostRecentResult = computed(() => glucoseData.data.value.at(0))

  const mostRecentHour: Ref<GlucoseRecord[]> = computed(() => {
    const hourBefore = new Date(mostRecentResult.value.created).getTime() - 60 * 60 * 1000
    return glucoseData.data.value.filter(record => new Date(record.created).getTime() > hourBefore)
  })

  const previous24Hours: Ref<GlucoseRecord[]> = computed(() => {
    const today = Date.now()
    const dayAgo = new Date(today - 24 * 60 * 60 * 1000)
    return glucoseData.data.value.filter(record => new Date(record.created) > dayAgo)
  })

  const longestStreakWithoutLowsInPrevious24Hours = computed(() => {
    return longestStreakWithoutLows(previous24Hours.value, 70)
  })

  const longestStreakWithoutHighsInPrevious24Hours = computed(() => {
    return longestStreakWithoutHighs(previous24Hours.value, 180)
  })

  const longestStreakWithoutLowsOrHighsInPrevious24Hours = computed(() => {
    return longestStreakWithoutLowsOrHighs(previous24Hours.value, 70, 180)
  })

  const percentTimeInRangeOverPrevious24Hours = computed(() => {
    const lowThreshold = 70
    const highThreshold = 180
    const records = previous24Hours.value
    const timeInRange = records.filter(record => record.value >= lowThreshold && record.value <= highThreshold)
    return ((timeInRange.length / records.length) * 100)
  })

  const cleanPercentTimeInRangeOverPrevious24Hours = computed(() => {
    return percentTimeInRangeOverPrevious24Hours.value.toFixed(2)
  })

  return {
    cleanPercentTimeInRangeOverPrevious24Hours,
    glucoseData,
    longestStreakWithoutLowsInPrevious24Hours,
    longestStreakWithoutHighsInPrevious24Hours,
    longestStreakWithoutLowsOrHighsInPrevious24Hours,
    mostRecentHour,
    mostRecentResult,
    percentTimeInRangeOverPrevious24Hours,
    previous24Hours,
  }
}
