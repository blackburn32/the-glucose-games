import type { GlucoseRecord } from '~/types/glucoseRecord.ts'
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import { cleanPercentForDisplay } from '~/utils/formatting/percentFormatting'

export const useGlucoseValues = () => {
  const nuxtApp = useNuxtApp()

  const glucoseData = nuxtApp.$glucoseValues
  const thresholds = nuxtApp.$thresholds

  const mostRecentResult = computed(() => glucoseData.value.at(-1))

  const mostRecentHour: Ref<GlucoseRecord[]> = computed(() => {
    if (!mostRecentResult.value) return []
    const hourBefore = mostRecentResult.value.created.getTime() - 60 * 60 * 1000
    return glucoseData.value.filter(record => record?.created.getTime() > hourBefore)
  })

  const previous24Hours = computed(() => {
    const today = Date.now()
    const dayAgo = new Date(today - 24 * 60 * 60 * 1000)
    const glucoseValues = glucoseData.value.filter(record => record.created > dayAgo)
    const percentTimeInRange = glucoseValues.length > 0 ? scoreRecordsByPercentTimeInRange(glucoseValues, thresholds.value) : undefined
    const cleanPercentTimeInRange = percentTimeInRange ? cleanPercentForDisplay(percentTimeInRange) : 'Unknown'
    return {
      glucoseValues,
      percentTimeInRange,
      cleanPercentTimeInRange,
    }
  })

  const mostRecentRecordWithinLastHour = computed(() => {
    const now = Date.now()
    const hourAgo = now - 60 * 60 * 1000
    const hourOfRecords = glucoseData.value.filter(record => record.created.getTime() > hourAgo)
    return hourOfRecords.at(-1)
  })

  return {
    mostRecentHour,
    mostRecentRecordWithinLastHour,
    previous24Hours,
  }
}
