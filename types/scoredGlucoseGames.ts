import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import type { TimeBasedDailyStreaks } from '~/types/timeBasedDailyStreaks'

export type ScoredGlucoseGames = {
  dailyStreakStats: {
    averageInRangeForAfternoons: DailyStreakStats
    averageInRangeForEvenings: DailyStreakStats
    averageInRangeForFullDay: DailyStreakStats
    averageInRangeForMornings: DailyStreakStats
    averageInRangeForNights: DailyStreakStats
    percentTimeInRangeForAfternoons: DailyStreakStats
    percentTimeInRangeForEvenings: DailyStreakStats
    percentTimeInRangeForFullDay: DailyStreakStats
    percentTimeInRangeForMornings: DailyStreakStats
    percentTimeInRangeForNights: DailyStreakStats
    percentTimeInRangeEveryFourHourPeriod: TimeBasedDailyStreaks
  }
  contiguousStreakStats: {
    noHighsStreaks: ContiguousStreakStats
    noHighsOrLowsStreaks: ContiguousStreakStats
    noLowsStreaks: ContiguousStreakStats
  }
}
