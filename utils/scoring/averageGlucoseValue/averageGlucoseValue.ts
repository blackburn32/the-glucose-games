import type { GlucoseRecord } from '~/types/glucoseRecord'

export const scoreRecordsByAverageGlucose = (records: GlucoseRecord[]) => {
  const total = records.length
  const sum = records.reduce((acc, record) => {
    return acc + record.value
  }, 0)
  return sum / total
}
