import { calculateContiguousStreakStats } from '~/utils/streaks/contiguousStreaks'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

export const contiguousStreakWithNoLows = (records: GlucoseRecord[], thresholds: Thresholds) => calculateContiguousStreakStats(
  'No Lows Streak',
  records,
  record => record.value >= thresholds.low,
  undefined,
  thresholds.low,
)

export const contiguousStreakWithNoHighs = (records: GlucoseRecord[], thresholds: Thresholds) => calculateContiguousStreakStats(
  'No Highs Streak',
  records,
  record => record.value <= thresholds.high,
  thresholds.high,
  undefined,
)

export const contiguousStreakWithNoLowsOrHighs = (records: GlucoseRecord[], thresholds: Thresholds) => calculateContiguousStreakStats(
  'No Lows or Highs Streak',
  records,
  record => record.value >= thresholds.low && record.value <= thresholds.high,
  thresholds.high,
  thresholds.low,
)
