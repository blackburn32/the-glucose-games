import parser from 'any-date-parser'
import { NIGHTSCOUT_PROVIDER_NAME, ONE_MONTH } from '~/types/constants'
import { generateRandomWalk } from '~/utils/generators/randomWalkGenerator/randomWalkGenerator'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getScoredGames } from '~/utils/games/scoredGames'
import { compareGlucoseDates } from '~/utils/data/compareGlucoseDates'

export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  const useDemoDataOverride = ref(false)
  const useDemoData = computed(() => {
    return useDemoDataOverride.value || !user.value
  })
  const durationOfData = ref(ONE_MONTH)

  const { hasNightscout, nightscoutSettings } = useNightscout()
  const { hasDexcom } = useTokenStatus()
  const { getGlucoseValueToDisplay } = useDisplaySettings()
  const { thresholds: storedThresholds } = useThresholds()
  const { thresholds: demoThresholds } = useDemoThresholds()

  const thresholds = computed(() => {
    return useDemoData.value ? demoThresholds.value : storedThresholds.value
  })

  const rawDemoData = ref(generateRandomWalk())
  const rawGlucoseData = useLazyFetch<GlucoseRecord[]>('/api/data', {
    key: 'glucoseData',
    default: () => [],
    retry: 3,
  })

  const finalizeGlucoseData = (data: GlucoseRecord[]) => {
    return data.map(record => ({
      ...record,
      value: getGlucoseValueToDisplay(record.value),
      y: getGlucoseValueToDisplay(record.value),
      created: parser.fromAny(record.created),
    })).sort(compareGlucoseDates)
  }

  const realData = computed(() => {
    const data = rawGlucoseData.data.value
    return finalizeGlucoseData(data)
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
    await rawGlucoseData.refresh()
  }

  const scoredGames = computed(() => getScoredGames(glucoseValues.value, thresholds.value))
  const demoScoredGames = computed(() => getScoredGames(demoData.value, demoThresholds.value))

  const isGlucoseDataLoading = computed(() => {
    if (useDemoData.value) return false
    return rawGlucoseData.status.value === 'pending'
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
