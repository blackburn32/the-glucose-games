import { tallyGameForSemanticPeriods } from '../tallyGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

export const countOutOfRangeTransitions = (recordsForPeriod: GlucoseRecord[], thresholds: Thresholds): number => {
  if (recordsForPeriod.length < 2) return 0

  let wasInRange = isInRange(recordsForPeriod[0].value, thresholds)
  let transitions = wasInRange ? 0 : 1

  for (let i = 1; i < recordsForPeriod.length; i++) {
    const currentInRange = isInRange(recordsForPeriod[i].value, thresholds)
    if (currentInRange !== wasInRange) {
      if (wasInRange) {
        transitions++
      }
      wasInRange = currentInRange
    }
  }

  return transitions
}

const isInRange = (value: number, thresholds: Thresholds): boolean => {
  return value > thresholds.low && value < thresholds.high
}

export const outOfRangeTransitionsForSemanticPeriods = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  return tallyGameForSemanticPeriods(
    records,
    thresholds,
    countOutOfRangeTransitions,
    0, // target is 0 transitions
    false, // we want to minimize transitions (targetAbove = false)
  )
}
