import type { Thresholds } from '~/types/thresholds'
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { percentTimeInRangeForSemanticPeriods, percentTimeInRangeForEveryFourHourPeriod } from '~/utils/games/percentTimeInRange/percentTimeInRangeGames'
import { contiguousStreakWithNoHighs, contiguousStreakWithNoLows, contiguousStreakWithNoLowsOrHighs } from '~/utils/games/contiguousStreak/contiguousStreakGames'
import { averageInRangeForSemanticPeriods } from '~/utils/games/averageInRange/averageInRangeGames'

export const getScoredGames = (allRecords: GlucoseRecord[], thresholds: Thresholds): ScoredGlucoseGames => {
  const dailyStreakStats = {
    averageInRangeForSemanticPeriods: averageInRangeForSemanticPeriods(allRecords, thresholds),
    percentTimeInRangeForSemanticPeriods: percentTimeInRangeForSemanticPeriods(allRecords, thresholds),
    percentTimeInRangeEveryFourHourPeriod: percentTimeInRangeForEveryFourHourPeriod(allRecords, thresholds),
  }
  const contiguousStreakStats = {
    noHighsStreaks: contiguousStreakWithNoHighs(allRecords, thresholds),
    noHighsOrLowsStreaks: contiguousStreakWithNoLowsOrHighs(allRecords, thresholds),
    noLowsStreaks: contiguousStreakWithNoLows(allRecords, thresholds),
  }
  return {
    dailyStreakStats,
    contiguousStreakStats,
  }
}
