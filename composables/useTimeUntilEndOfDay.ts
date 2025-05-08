import { computed } from 'vue'
import prettyMilliseconds from 'pretty-ms'
import type { Timing } from '~/types/timing'

export function useTimeUntilEndOfDay(options: { secondsDecimalDigits?: number, compact?: boolean } = { secondsDecimalDigits: 0, compact: true }) {
  return computed(() => {
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    return prettyMilliseconds(endOfDay.getTime() - now.getTime(), options)
  })
}

export function useTimeUntilEndOfSemanticPeriod(semanticPeriod: Ref<Timing>, options: { secondsDecimalDigits?: number, compact?: boolean } = { secondsDecimalDigits: 0, compact: true }) {
  return computed(() => {
    const now = new Date()

    const startOfSemanticPeriod = new Date(now)
    startOfSemanticPeriod.setHours(semanticPeriod.value.startHour, semanticPeriod.value.startMinutes, 0, 0)
    if (now.getTime() < startOfSemanticPeriod.getTime()) {
      return `${prettyMilliseconds(startOfSemanticPeriod.getTime() - now.getTime(), options)} until start`
    }

    const endOfSemanticPeriod = new Date(now)
    endOfSemanticPeriod.setHours(semanticPeriod.value.endHour, semanticPeriod.value.endMinutes, 0, 0)
    if (now.getTime() > endOfSemanticPeriod.getTime()) {
      return 'for the day'
    }
    return `${prettyMilliseconds(endOfSemanticPeriod.getTime() - now.getTime(), options)} left in the day`
  })
}
