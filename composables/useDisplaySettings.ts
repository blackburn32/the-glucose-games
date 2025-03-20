import { DEFAULT_DISPLAY_SETTINGS, MMOL_CONVERSION_FACTOR } from '~/types/constants'
import type { DisplaySettings } from '~/types/displaySettings'

export const useDisplaySettings = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()

  const currentDisplaySettings = useAsyncData<DisplaySettings>('displaySettings', async () => {
    if (!user.value) {
      return DEFAULT_DISPLAY_SETTINGS
    }
    const { data, error } = await supabase.from('display_settings').select('*').maybeSingle()
    if (error) {
      toast.add({
        title: 'Error fetching display settings',
        description: error.message,
        color: 'red',
      })
    }
    if (!data) {
      return DEFAULT_DISPLAY_SETTINGS
    }
    return {
      useMmol: data.use_mmol,
    }
  }, {
    default: () => {
      return DEFAULT_DISPLAY_SETTINGS
    },
  })

  const setDisplaySettings = async (newDisplaySettings: DisplaySettings) => {
    const userId = user.value?.id
    if (!userId) {
      toast.add({
        title: 'Not logged in',
        description: 'You need to be logged in to save display settings',
        color: 'red',
      })
      return
    }
    const { error } = await supabase.from('display_settings').upsert({
      use_mmol: newDisplaySettings.useMmol,
      user_id: userId,
    })
    if (error) {
      toast.add({
        title: 'Error saving thresholds',
        description: error.message,
        color: 'red',
      })
    }
    await currentDisplaySettings.refresh()
  }

  const displaySettings = computed({
    get() {
      return currentDisplaySettings.data.value
    },
    set(value) {
      if (value)
        setDisplaySettings(value)
    },
  })

  const useMmol = computed({
    get() {
      return displaySettings.value.useMmol
    },
    set(value) {
      setDisplaySettings({ ...displaySettings.value, useMmol: value })
    },
  })

  const unit = computed(() => {
    return displaySettings.value.useMmol ? 'mmol/L' : 'mg/dL'
  })

  const roundToOneDecimal = (sgv: number) => {
    return Math.round(sgv * 10) / 10
  }

  const getGlucoseValue = (sgv: number) => {
    return displaySettings.value.useMmol ? roundToOneDecimal(sgv / MMOL_CONVERSION_FACTOR) : roundToOneDecimal(sgv)
  }

  const getCleanGlucoseValue = (sgv: number) => {
    return `${getGlucoseValue(sgv).toFixed(2)}`
  }

  const getGlucoseValueToDisplay = (sgv: number) => {
    const value = getGlucoseValue(sgv)
    return `${value.toFixed(1)} ${unit.value}`
  }

  return {
    displaySettings,
    getCleanGlucoseValue,
    getGlucoseValue,
    getGlucoseValueToDisplay,
    setDisplaySettings,
    unit,
    useMmol,
  }
}
