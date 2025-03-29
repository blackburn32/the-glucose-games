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
        color: 'error',
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
        color: 'error',
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
        color: 'error',
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

  const getGlucoseValueToDisplay = (sgv: number) => {
    return displaySettings.value.useMmol ? roundToOneDecimal(sgv / MMOL_CONVERSION_FACTOR) : roundToOneDecimal(sgv)
  }

  const getCleanGlucoseValue = (sgv: number) => {
    return `${getGlucoseValueToDisplay(sgv).toFixed(2)}`
  }

  const getGlucoseValueWithUnit = (sgv: number) => {
    const value = getGlucoseValueToDisplay(sgv)
    return `${value.toFixed(1)} ${unit.value}`
  }

  const withUnit = (value: string | undefined) => {
    if (value === undefined) return 'Unknown'
    return `${value} ${unit.value}`
  }

  return {
    displaySettings,
    getCleanGlucoseValue,
    getGlucoseValueToDisplay,
    getGlucoseValueWithUnit,
    setDisplaySettings,
    unit,
    useMmol,
    withUnit,
  }
}
