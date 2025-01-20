import type { GlucoseRecord } from '~/types/types.ts'
import { currentDailyAverageStreak, currentDailyStreakWithTimePeriodInRange, currentDayStreakWithinRange, longestStreakWithoutHighs, longestStreakWithoutLows, longestStreakWithoutLowsOrHighs } from '~/utils/glucoseGames.ts'

export const useGlucoseValues = () => {
  const glucoseDataRaw = useFetch<GlucoseRecord[]>('/api/data', {
    key: 'glucoseData',
    default: () => [],
    immediate: true,
  })

  const glucoseData: Ref<GlucoseRecord[]> = computed(() => {
    return glucoseDataRaw.data.value.map(record => ({
      ...record,
      created: new Date(record.created),
    })).sort((a, b) => a.created.getTime() - b.created.getTime())
  })

  const calculatePercentTimeInRange = (records: GlucoseRecord[], thresholds: { low: number, high: number }) => {
    if (!records) return 0
    const timeInRange = records.filter(record => record.value > thresholds.low && record.value < thresholds.high)
    return ((timeInRange.length / records.length) * 100)
  }

  const cleanPercentForDisplay = (percentTimeInRange: number) => {
    return percentTimeInRange.toFixed(2)
  }

  const thresholds = useThresholds()

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
    const percentTimeInRange = calculatePercentTimeInRange(glucoseValues, thresholds.value)
    const cleanPercentTimeInRange = cleanPercentForDisplay(percentTimeInRange)
    return {
      glucoseValues,
      percentTimeInRange,
      cleanPercentTimeInRange,
    }
  })

  const today = computed(() => {
    const now = new Date()
    const todayMidnight = new Date().setHours(0, 0, 0, 0)

    const glucoseValues = glucoseData.value.filter(record => record.created >= todayMidnight && record.created <= now)
    const percentTimeInRange = calculatePercentTimeInRange(glucoseValues ?? [], thresholds.value)
    const cleanPercentTimeInRange = cleanPercentForDisplay(percentTimeInRange)
    return {
      glucoseValues,
      percentTimeInRange,
      cleanPercentTimeInRange,
    }
  })

  const longestStreakWithoutLowsInPrevious24Hours = computed(() => {
    return longestStreakWithoutLows(previous24Hours.value.glucoseValues, thresholds.value.low)
  })

  const longestStreakWithoutHighsInPrevious24Hours = computed(() => {
    return longestStreakWithoutHighs(previous24Hours.value.glucoseValues, thresholds.value.high)
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

  const currentStreakOfDaysWithinRange = computed(() => {
    return currentDayStreakWithinRange(glucoseData.value, 80, thresholds.value.low, thresholds.value.high)
  })

  const currentStreakOfNightsWithinRange = computed(() => {
    return currentDailyStreakWithTimePeriodInRange(glucoseData.value, 0, 6, thresholds.value.low, thresholds.value.high, 80)
  })

  const currentDailyAverage = computed(() => {
    if (!glucoseData.value.length) return 100
    return glucoseData.value.reduce((acc, record) => acc + record.value, 0) / glucoseData.value.length
  })

  const currentStreakOfDailyAveragesWithinRange = computed(() => {
    return currentDailyAverageStreak(glucoseData.value, thresholds.value.low, thresholds.value.high)
  })

  const lastNight = computed(() => {
    const now = new Date()
    const todayMidnight = new Date().setHours(0, 0, 0, 0)
    const todayMorning = new Date().setHours(6, 0, 0, 0)

    const [start, end] = now < todayMorning
      ? [new Date(todayMidnight).setDate(new Date(todayMidnight).getDate() - 1), new Date(todayMorning).setDate(new Date(todayMorning).getDate() - 1)]
      : [todayMidnight, todayMorning]

    const glucoseValues = glucoseData.value.filter(record => record.created > start && record.created < end)
    const percentTimeInRange = calculatePercentTimeInRange(glucoseValues ?? [], thresholds.value)
    const cleanPercentTimeInRange = cleanPercentForDisplay(percentTimeInRange)
    return {
      glucoseValues,
      percentTimeInRange,
      cleanPercentTimeInRange,
    }
  })

  return {
    currentStreakWithoutHighs,
    currentStreakWithoutHighsOrLows,
    currentStreakWithoutLows,
    currentStreakOfDaysWithinRange,
    currentStreakOfNightsWithinRange,
    currentDailyAverage,
    currentStreakOfDailyAveragesWithinRange,
    glucoseData,
    lastNight,
    longestStreakWithoutLowsInPrevious24Hours,
    longestStreakWithoutHighsInPrevious24Hours,
    longestStreakWithoutLowsOrHighsInPrevious24Hours,
    mostRecentHour,
    mostRecentResult,
    previous24Hours,
    today,
  }
}
