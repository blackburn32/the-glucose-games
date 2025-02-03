import type { Thresholds } from '~/types/thresholds.ts'

export const useThresholds = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()

  const currentThresholds = useAsyncData<Thresholds>('thresholds', async () => {
    if (!user.value) {
      return {
        low: 70,
        high: 180,
      }
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
      return {
        low: 70,
        high: 180,
      }
    }
    return {
      low: data.low,
      high: data.high,
    }
  }, {
    default: () => {
      return {
        low: 70,
        high: 180,
      }
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
      updated_at: new Date().toISOString(),
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
