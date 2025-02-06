import type { Thresholds } from '~/types/thresholds'
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { averageInRangeForFullDayStreak } from '~/utils/games/averageInRange/averangeInRangeGames'
import { percentTimeInRangeForAfternoonsStreak, percentTimeInRangeForEveningsStreak, percentTimeInRangeForFullDayStreak, percentTimeInRangeForMorningsStreak, percentTimeInRangeForNightsStreak } from '~/utils/games/percentTimeInRange/percentTimeInRangeGames'
import { contiguousStreakWithNoHighs, contiguousStreakWithNoLows, contiguousStreakWithNoLowsOrHighs } from '~/utils/games/contiguousStreak/contiguousStreakGames'

export const getScoredGames = (allRecords: GlucoseRecord[], thresholds: Thresholds): ScoredGlucoseGames => {
  const dailyStreakStats = {
    averageInRangeForFullDay: averageInRangeForFullDayStreak(allRecords, thresholds),
    percentTimeInRangeForAfternoons: percentTimeInRangeForAfternoonsStreak(allRecords, thresholds, 80),
    percentTimeInRangeForEvenings: percentTimeInRangeForEveningsStreak(allRecords, thresholds, 80),
    percentTimeInRangeForFullDay: percentTimeInRangeForFullDayStreak(allRecords, thresholds, 80),
    percentTimeInRangeForMornings: percentTimeInRangeForMorningsStreak(allRecords, thresholds, 80),
    percentTimeInRangeForNights: percentTimeInRangeForNightsStreak(allRecords, thresholds, 80),
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
