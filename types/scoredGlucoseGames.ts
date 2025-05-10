import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import type { TimeBasedDailyStreaks } from '~/types/timeBasedDailyStreaks'

export type ScoredGlucoseGames = {
  dailyStreakStats: {
    averageInRangeForSemanticPeriods: TimeBasedDailyStreaks
    percentTimeInRangeForSemanticPeriods: TimeBasedDailyStreaks
    percentTimeInRangeEveryFourHourPeriod: TimeBasedDailyStreaks
    outOfRangeTransitionsForSemanticPeriods: TimeBasedDailyStreaks
  }
  contiguousStreakStats: {
    noHighsStreaks: ContiguousStreakStats
    noHighsOrLowsStreaks: ContiguousStreakStats
    noLowsStreaks: ContiguousStreakStats
  }
}
