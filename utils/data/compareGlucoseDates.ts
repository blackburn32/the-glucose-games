import type { GlucoseRecord } from '~/types/glucoseRecord'

export const compareGlucoseDates = (a: GlucoseRecord, b: GlucoseRecord) => {
  return a.created.getTime() - b.created.getTime()
}
