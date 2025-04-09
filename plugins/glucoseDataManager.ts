import parser from 'any-date-parser'
import type { FetchError } from 'ofetch'
import { NIGHTSCOUT_PROVIDER_NAME, ONE_MONTH, THREE_MONTHS } from '~/types/constants'
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
    return useDemoDataOverride.value || !user.value
  })
  const durationOfData = ref(THREE_MONTHS)

  const { hasNightscout, nightscoutSettings } = useNightscout()
  const { hasDexcom } = useTokenStatus()
  const { getGlucoseValueToDisplay } = useDisplaySettings()
  const { thresholds } = useThresholds()

  const timestamps = getTimestampsBetweenDatesUsingDuration(new Date(Date.now() - durationOfData.value), new Date(), ONE_MONTH)

  const fetches: Ref<AsyncData<GlucoseRecord[], FetchError<string> | null>[]> = ref([])
  timestamps.forEach((timestamp, index) => {
    const nextTimestamp = timestamps[index + 1] ?? Date.now()
    fetches.value.push(useLazyFetch<GlucoseRecord[], FetchError<string>>('/api/data', {
      key: `glucoseData${index}`,
      method: 'POST',
      default: () => [],
      body: {
        start: new Date(timestamp),
        end: new Date(nextTimestamp),
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

  const finalizeGlucoseData = (data: GlucoseRecord[]) => {
    return data.map(record => ({
      ...record,
      value: getGlucoseValueToDisplay(record.value),
      y: getGlucoseValueToDisplay(record.value),
      created: parser.fromAny(record.created),
    })).sort(compareGlucoseDates)
  }

  const realData = computed(() => {
    return finalizeGlucoseData(allRawData.value)
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

  const refreshData = async () => {
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
    return glucoseValues.value.some(record => record.provider === NIGHTSCOUT_PROVIDER_NAME)
  })

  const randomizeDemoData = () => {
    rawDemoData.value = generateRandomWalk()
  }

  watch([user, hasDexcom, hasNightscout, nightscoutSettings], () => {
    refreshData()
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
