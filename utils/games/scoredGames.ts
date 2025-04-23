import type { Thresholds } from '~/types/thresholds'
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { averageInRangeForAfternoonsStreak, averageInRangeForEveningsStreak, averageInRangeForFullDayStreak, averageInRangeForMorningsStreak, averageInRangeForNightsStreak } from '~/utils/games/averageInRange/averageInRangeGames'
import { percentTimeInRangeForAfternoonsStreak, percentTimeInRangeForEveningsStreak, percentTimeInRangeForEveryFourHourPeriod, percentTimeInRangeForFullDayStreak, percentTimeInRangeForMorningsStreak, percentTimeInRangeForNightsStreak } from '~/utils/games/percentTimeInRange/percentTimeInRangeGames'
import { contiguousStreakWithNoHighs, contiguousStreakWithNoLows, contiguousStreakWithNoLowsOrHighs } from '~/utils/games/contiguousStreak/contiguousStreakGames'

export const getScoredGames = (allRecords: GlucoseRecord[], thresholds: Thresholds): ScoredGlucoseGames => {
  const dailyStreakStats = {
    averageInRangeForAfternoons: averageInRangeForAfternoonsStreak(allRecords, thresholds),
    averageInRangeForEvenings: averageInRangeForEveningsStreak(allRecords, thresholds),
    averageInRangeForFullDay: averageInRangeForFullDayStreak(allRecords, thresholds),
    averageInRangeForMornings: averageInRangeForMorningsStreak(allRecords, thresholds),
    averageInRangeForNights: averageInRangeForNightsStreak(allRecords, thresholds),
    percentTimeInRangeForAfternoons: percentTimeInRangeForAfternoonsStreak(allRecords, thresholds),
    percentTimeInRangeForEvenings: percentTimeInRangeForEveningsStreak(allRecords, thresholds),
    percentTimeInRangeForFullDay: percentTimeInRangeForFullDayStreak(allRecords, thresholds),
    percentTimeInRangeForMornings: percentTimeInRangeForMorningsStreak(allRecords, thresholds),
    percentTimeInRangeForNights: percentTimeInRangeForNightsStreak(allRecords, thresholds),
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
