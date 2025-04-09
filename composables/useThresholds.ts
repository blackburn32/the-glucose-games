import type { Thresholds } from '~/types/thresholds.ts'
import { DEFAULT_THRESHOLDS, MMOL_CONVERSION_FACTOR } from '~/types/constants'

export const useThresholds = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const useDemoData = nuxtApp.$useDemoData
  const { getGlucoseValueToDisplay, useMmol } = useDisplaySettings()
  const { thresholds: demoThresholds, setThresholds: setDemoThresholds } = useDemoThresholds()

  const currentThresholds = useAsyncData<Thresholds>('thresholds', async () => {
    if (!user.value || useDemoData.value) {
      return demoThresholds.value
    }
    const { data, error } = await supabase.from('thresholds').select('*').maybeSingle()
    if (error) {
      toast.add({
        title: 'Error fetching thresholds',
        description: error.message,
        color: 'error',
      })
    }
    if (!data) {
      return DEFAULT_THRESHOLDS
    }
    return {
      low: data.low,
      high: data.high,
      target: data.target,
      dailyStreakPercentTimeInRange: data.daily_percent_time_in_range,
    }
  }, {
    default: () => {
      return demoThresholds.value
    },
  })

  const highThresholdBounds = computed(() => {
    return {
      max: useMmol.value ? 21 : 400,
      min: useMmol.value ? 6.7 : 120,
    }
  })

  const lowThresholdBounds = computed(() => {
    return {
      max: useMmol.value ? 6.7 : 120,
      min: useMmol.value ? 2.3 : 40,
    }
  })

  const targetBloodGlucoseBounds = computed(() => {
    return {
      max: useMmol.value ? 9.8 : 180,
      min: useMmol.value ? 4.4 : 80,
    }
  })

  const setThresholds = async (newThresholds: Thresholds) => {
    const userId = user.value?.id
    if (newThresholds.low < lowThresholdBounds.value.min || newThresholds.low > lowThresholdBounds.value.max) {
      toast.add({
        title: 'Invalid low threshold',
        description: `Low threshold must be between ${lowThresholdBounds.value.min} and ${lowThresholdBounds.value.max}`,
        color: 'error',
      })
      return
    }
    if (newThresholds.high < highThresholdBounds.value.min || newThresholds.high > highThresholdBounds.value.max) {
      toast.add({
        title: 'Invalid high threshold',
        description: `High threshold must be between ${highThresholdBounds.value.min} and ${highThresholdBounds.value.max}`,
        color: 'error',
      })
      return
    }
    if (newThresholds.target < targetBloodGlucoseBounds.value.min || newThresholds.target > targetBloodGlucoseBounds.value.max) {
      toast.add({
        title: 'Invalid target blood glucose',
        description: `Target blood glucose must be between ${targetBloodGlucoseBounds.value.min} and ${targetBloodGlucoseBounds.value.max}`,
        color: 'error',
      })
      return
    }
    if (newThresholds.dailyStreakPercentTimeInRange > 100 || newThresholds.dailyStreakPercentTimeInRange < 0) {
      toast.add({
        title: 'Invalid daily streak percent time in range',
        description: 'Percent time in range must be between 0 and 100',
        color: 'error',
      })
      return
    }
    const valueToSet = {
      ...newThresholds,
      low: useMmol.value ? newThresholds.low * MMOL_CONVERSION_FACTOR : newThresholds.low,
      high: useMmol.value ? newThresholds.high * MMOL_CONVERSION_FACTOR : newThresholds.high,
      target: useMmol.value ? newThresholds.target * MMOL_CONVERSION_FACTOR : newThresholds.target,
    }
    if (useDemoData.value || !userId) {
      setDemoThresholds(valueToSet)
      await currentThresholds.refresh()
      return
    }
    const { error } = await supabase.from('thresholds').upsert({
      low: valueToSet.low,
      high: valueToSet.high,
      target: valueToSet.target,
      daily_percent_time_in_range: valueToSet.dailyStreakPercentTimeInRange,
      user_id: userId,
    })
    if (error) {
      toast.add({
        title: 'Error saving thresholds',
        description: error.message,
        color: 'error',
      })
    }
    await currentThresholds.refresh()
  }

  const thresholds = computed({
    get() {
      return {
        ...currentThresholds.data.value,
        low: getGlucoseValueToDisplay(currentThresholds.data.value.low),
        high: getGlucoseValueToDisplay(currentThresholds.data.value.high),
        target: getGlucoseValueToDisplay(currentThresholds.data.value.target),
      }
    },
    set(value) {
      if (value)
        setThresholds(value)
    },
  })

  watch([user, useDemoData], () => {
    currentThresholds.refresh()
  })

  return {
    highThresholdBounds,
    lowThresholdBounds,
    setThresholds,
    targetBloodGlucoseBounds,
    thresholds,
  }
}
