import type { Thresholds } from '~/types/thresholds.ts'
import { DEFAULT_THRESHOLDS } from '~/types/constants'

export const useThresholds = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()

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

  const setThresholds = async (newThresholds: Thresholds) => {
    const userId = user.value?.id
    if (newThresholds.low < 40 || newThresholds.low > 120) {
      toast.add({
        title: 'Invalid low threshold',
        description: 'Low threshold must be between 0 and 120',
        color: 'red',
      })
      return
    }
    if (newThresholds.high < 120 || newThresholds.high > 400) {
      toast.add({
        title: 'Invalid high threshold',
        description: 'High threshold must be between 120 and 400',
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
    const { error } = await supabase.from('thresholds').upsert({
      low: newThresholds.low,
      high: newThresholds.high,
      target: newThresholds.target,
      daily_percent_time_in_range: newThresholds.dailyStreakPercentTimeInRange,
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
      return currentThresholds.data.value
    },
    set(value) {
      if (value)
        setThresholds(value)
    },
  })

  return {
    thresholds,
    setThresholds,
  }
}
