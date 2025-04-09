import { DEFAULT_DISPLAY_SETTINGS } from '~/types/constants'
import type { DisplaySettings } from '~/types/displaySettings'

export const useDemoDisplaySettings = () => {
  const displaySettings = useState<DisplaySettings>('demoDisplaySettings', () => {
    return DEFAULT_DISPLAY_SETTINGS
  })

  const setDisplaySettings = (newDisplaySettings: DisplaySettings) => {
    displaySettings.value = newDisplaySettings
  }

  return {
    displaySettings,
    setDisplaySettings,
  }
}
