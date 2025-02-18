import type { GlucoseRecord } from '~/types/glucoseRecord'
import { Trend } from '~/types/trend'

export const scoreRecordsByTrendControl = (
  records: GlucoseRecord[],
  unacceptableTrends: Trend[],
) => {
  const total = records.length
  const inRange = records.filter((record) => {
    const currentTrend = record.trend || Trend.unknown
    return !unacceptableTrends.includes(currentTrend as Trend)
  }).length
  return (inRange / total) * 100
}
