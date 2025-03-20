import type { Thresholds } from '~/types/thresholds.ts'
import { DEFAULT_THRESHOLDS } from '~/types/constants'

export const useThresholds = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()
  const { getGlucoseValue, useMmol } = useDisplaySettings()

  const currentThresholds = useAsyncData<Thresholds>('thresholds', async () => {
    if (!user.value) {
      return DEFAULT_THRESHOLDS
    }
    const { data, error } = await supabase.from('thresholds').select('*').maybeSingle()
    if (error) {
      toast.add({
        title: 'Error fetching thresholds',
        description: error.message,
        color: 'red',
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
      return DEFAULT_THRESHOLDS
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
        color: 'red',
      })
      return
    }
    if (newThresholds.high < highThresholdBounds.value.min || newThresholds.high > highThresholdBounds.value.max) {
      toast.add({
        title: 'Invalid high threshold',
        description: `High threshold must be between ${highThresholdBounds.value.min} and ${highThresholdBounds.value.max}`,
        color: 'red',
      })
      return
    }
    if (newThresholds.target < targetBloodGlucoseBounds.value.min || newThresholds.target > targetBloodGlucoseBounds.value.max) {
      toast.add({
        title: 'Invalid target blood glucose',
        description: `Target blood glucose must be between ${targetBloodGlucoseBounds.value.min} and ${targetBloodGlucoseBounds.value.max}`,
        color: 'red',
      })
      return
    }
    if (newThresholds.dailyStreakPercentTimeInRange > 100 || newThresholds.dailyStreakPercentTimeInRange < 0) {
      toast.add({
        title: 'Invalid daily streak percent time in range',
        description: 'Percent time in range must be between 0 and 100',
        color: 'red',
      })
      return
    }
    if (!userId) {
      toast.add({
        title: 'Not logged in',
        description: 'You need to be logged in to save thresholds',
        color: 'red',
      })
      return
    }
    const valueToSet = {
      ...newThresholds,
      low: useMmol.value ? newThresholds.low * 18.182 : newThresholds.low,
      high: useMmol.value ? newThresholds.high * 18.182 : newThresholds.high,
      target: useMmol.value ? newThresholds.target * 18.182 : newThresholds.target,
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
        color: 'red',
      })
    }
    await currentThresholds.refresh()
  }

  const thresholds = computed({
    get() {
      return {
        ...currentThresholds.data.value,
        low: getGlucoseValue(currentThresholds.data.value.low),
        high: getGlucoseValue(currentThresholds.data.value.high),
        target: getGlucoseValue(currentThresholds.data.value.target),
      }
    },
    set(value) {
      if (value)
        setThresholds(value)
    },
  })

  return {
    highThresholdBounds,
    lowThresholdBounds,
    setThresholds,
    targetBloodGlucoseBounds,
    thresholds,
  }
}
