import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

export const scoreRecordsByPercentTimeInRange = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  const { high, low } = thresholds
  const total = records.length
  const inRange = records.filter((record) => {
    return record.value >= low && record.value <= high
  }).length
  return (inRange / total) * 100
}
