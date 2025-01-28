import { calculateContiguousStreakStats } from '~/utils/glucoseGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

export const contiguousStreakWithNoLows = (records: GlucoseRecord[], thresholds: Thresholds) => calculateContiguousStreakStats(
  records,
  record => record.value >= thresholds.low,
)

export const contiguousStreakWithNoHighs = (records: GlucoseRecord[], thresholds: Thresholds) => calculateContiguousStreakStats(
  records,
  record => record.value <= thresholds.high,
)

export const contiguousStreakWithNoLowsOrHighs = (records: GlucoseRecord[], thresholds: Thresholds) => calculateContiguousStreakStats(
  records,
  record => record.value >= thresholds.low && record.value <= thresholds.high,
)
