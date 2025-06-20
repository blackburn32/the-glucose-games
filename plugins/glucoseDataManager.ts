import parser from 'any-date-parser'
import type { FetchError } from 'ofetch'
import { useInterval } from '@vueuse/shared'
import { FIVE_MINUTES, NIGHTSCOUT_PROVIDER_NAME, ONE_MONTH, SIX_MONTHS, THIRTY_SECONDS, THREE_MONTHS } from '~/types/constants'
import { generateRandomWalk } from '~/utils/generators/randomWalkGenerator/randomWalkGenerator'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getScoredGames } from '~/utils/games/scoredGames'
import { compareGlucoseDates } from '~/utils/data/compareGlucoseDates'
import { getTimestampsBetweenDatesUsingDuration } from '~/utils/timing/timeSlicers'
import type { AsyncData } from '#app'
import { groupRecordsByDay } from '~/utils/records/groupRecords'

export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  const useDemoDataOverride = ref(false)
  const useDemoData = computed(() => {
    return useDemoDataOverride.value || !user.value || !hasNightscoutData.value
  })
  const durationOfData = ref(SIX_MONTHS)
  const filteredDurationOfData = ref(THREE_MONTHS)
  const includeRecordsSince = computed(() => {
    const now = new Date()
    return new Date(now.getTime() - filteredDurationOfData.value)
  })
  const includeRecordsForTrendsSince = computed(() => {
    return new Date(includeRecordsSince.value.getTime() - filteredDurationOfData.value)
  })

  const { hasNightscout, nightscoutSettings } = useNightscout()
  const { getGlucoseValueToDisplay } = useDisplaySettings()
  const { thresholds } = useThresholds()

  const generateTimestamps = () => getTimestampsBetweenDatesUsingDuration(new Date(Date.now() - durationOfData.value), new Date(), ONE_MONTH)
  const timestamps = ref(generateTimestamps())

  const fetches: Ref<AsyncData<GlucoseRecord[], FetchError<string> | null>[]> = ref([])
  timestamps.value.forEach((timestamp, index) => {
    const nextTimestamp = timestamps.value[index + 1]
    fetches.value.push(useLazyFetch<GlucoseRecord[], FetchError<string>>('/api/data', {
      key: `glucoseData${index}`,
      method: 'POST',
      default: () => [],
      body: {
        start: new Date(timestamp),
        end: nextTimestamp ? new Date(nextTimestamp) : undefined,
      },
      immediate: true,
    }))
  })

  const allRawData = computed(() => {
    const allData: GlucoseRecord[] = []
    fetches.value.forEach((fetch) => {
      if (fetch.data.value) {
        allData.push(...fetch.data.value)
      }
    })
    return allData
  })

  const rawDemoData = ref(generateRandomWalk(undefined, 4000, 60))

  const finalizeGlucoseData = (data: GlucoseRecord[], timezoneOffset = 0) => {
    return data.map((record) => {
      const tolerantDate = parser.fromAny(record.created)
      const date = new Date(tolerantDate.getTime() - timezoneOffset)
      return {
        ...record,
        value: getGlucoseValueToDisplay(record.value),
        y: getGlucoseValueToDisplay(record.value),
        created: date,
      }
    }).sort(compareGlucoseDates)
  }

  const realData = computed(() => {
    return finalizeGlucoseData(allRawData.value, new Date().getTimezoneOffset() * 60 * 1000)
  })

  const demoData = computed(() => {
    const data = rawDemoData.value
    return finalizeGlucoseData(data)
  })

  const glucoseValues: Ref<GlucoseRecord[]> = computed(() => {
    if (useDemoData.value) {
      return demoData.value
    }
    return realData.value
  })

  const filteredGlucoseValues = computed(() => {
    return glucoseValues.value.filter(record => record.created >= includeRecordsSince.value)
  })

  const recordsForTrends = computed(() => {
    return glucoseValues.value.filter(record => record.created >= includeRecordsForTrendsSince.value && record.created <= includeRecordsSince.value)
  })

  const refreshData = async () => {
    await Promise.all(fetches.value.map(fetch => fetch.refresh()))
  }
  const refreshMostRecentData = async () => {
    await fetches.value.at(-1)?.refresh()
  }

  const recordsGroupedByDay = computed(() => groupRecordsByDay(glucoseValues.value))
  const filteredRecordsGroupedByDay = computed(() => groupRecordsByDay(filteredGlucoseValues.value))
  const recordsForTrendsGroupedByDay = computed(() => groupRecordsByDay(recordsForTrends.value))

  const scoredGames = computed(() => getScoredGames(glucoseValues.value, thresholds.value, recordsGroupedByDay.value))
  const filteredScoredGames = computed(() => getScoredGames(filteredGlucoseValues.value, thresholds.value, filteredRecordsGroupedByDay.value))
  const scoredGamesForTrends = computed(() => getScoredGames(recordsForTrends.value, thresholds.value, recordsForTrendsGroupedByDay.value))

  const isGlucoseDataLoading = computed(() => {
    if (useDemoData.value) return false
    return fetches.value.at(-1)?.status.value === 'pending'
  })

  const hasGlucoseData = computed(() => {
    return glucoseValues.value.length > 0
  })

  const hasNightscoutData = computed(() => {
    return allRawData.value.some(record => record.provider === NIGHTSCOUT_PROVIDER_NAME)
  })

  const randomizeDemoData = () => {
    rawDemoData.value = generateRandomWalk(undefined, 4000, 60)
  }

  watch([() => user, () => hasNightscout, () => nightscoutSettings], () => {
    refreshData()
  }, { deep: true })

  const latestResult = computed(() => {
    return glucoseValues.value.at(-1)
  })
  const timeSinceLatestResult = computed(() => {
    if (!latestResult.value) return FIVE_MINUTES
    const now = new Date()
    return now.getTime() - latestResult.value.created.getTime()
  })

  const refreshMostRecentDataIfSignedIn = () => {
    if (user.value) {
      if (timeSinceLatestResult.value >= FIVE_MINUTES) {
        refreshMostRecentData()
      }
    }
  }
  useInterval(THIRTY_SECONDS, {
    callback: refreshMostRecentDataIfSignedIn,
  })

  return {
    provide: {
      demoData,
      durationOfData,
      filteredDurationOfData,
      filteredGlucoseValues,
      filteredScoredGames,
      glucoseValues,
      hasGlucoseData,
      hasNightscoutData,
      isGlucoseDataLoading,
      randomizeDemoData,
      recordsForTrends,
      refreshData,
      scoredGames,
      scoredGamesForTrends,
      thresholds,
      useDemoData,
      useDemoDataOverride,
    },
  }
})
