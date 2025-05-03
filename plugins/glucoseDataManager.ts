import parser from 'any-date-parser'
import type { FetchError } from 'ofetch'
import { useInterval } from '@vueuse/shared'
import { FIVE_MINUTES, NIGHTSCOUT_PROVIDER_NAME, ONE_MONTH, THIRTY_SECONDS, THREE_MONTHS } from '~/types/constants'
import { generateRandomWalk } from '~/utils/generators/randomWalkGenerator/randomWalkGenerator'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getScoredGames } from '~/utils/games/scoredGames'
import { compareGlucoseDates } from '~/utils/data/compareGlucoseDates'
import { getTimestampsBetweenDatesUsingDuration } from '~/utils/timing/timeSlicers'
import type { AsyncData } from '#app'

export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  const useDemoDataOverride = ref(false)
  const useDemoData = computed(() => {
    return useDemoDataOverride.value || !user.value || !hasNightscoutData.value
  })
  const durationOfData = ref(THREE_MONTHS)
  const fetchRecordsSince = computed(() => {
    const now = new Date()
    return new Date(now.getTime() - durationOfData.value)
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

  const rawDemoData = ref(generateRandomWalk())

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
    const start = fetchRecordsSince.value
    if (useDemoData.value) {
      return demoData.value.filter(record => record.created >= start)
    }
    return realData.value.filter(record => record.created >= start)
  })

  const refreshData = async () => {
    await Promise.all(fetches.value.map(fetch => fetch.refresh()))
  }
  const refreshMostRecentData = async () => {
    await fetches.value.at(-1)?.refresh()
  }

  const scoredGames = computed(() => getScoredGames(glucoseValues.value, thresholds.value))
  const demoScoredGames = computed(() => getScoredGames(demoData.value, thresholds.value))

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
    rawDemoData.value = generateRandomWalk()
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
      demoScoredGames,
      durationOfData,
      glucoseValues,
      hasGlucoseData,
      hasNightscoutData,
      isGlucoseDataLoading,
      randomizeDemoData,
      refreshData,
      scoredGames,
      thresholds,
      useDemoData,
      useDemoDataOverride,
    },
  }
})
