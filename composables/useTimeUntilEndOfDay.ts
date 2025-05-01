import { computed } from 'vue'
import prettyMilliseconds from 'pretty-ms'

export function useTimeUntilEndOfDay(options: { secondsDecimalDigits?: number, compact?: boolean } = { secondsDecimalDigits: 0, compact: true }) {
  return computed(() => {
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    return prettyMilliseconds(endOfDay.getTime() - now.getTime(), options)
  })
}
