import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import type { DailyStreakStats } from '~/types/dailyStreakStats'

export type ScoredGlucoseGames = {
  dailyStreakStats: {
    averageInRangeForFullDay: DailyStreakStats
    percentTimeInRangeForAfternoons: DailyStreakStats
    percentTimeInRangeForEvenings: DailyStreakStats
    percentTimeInRangeForFullDay: DailyStreakStats
    percentTimeInRangeForMornings: DailyStreakStats
    percentTimeInRangeForNights: DailyStreakStats
  }
  contiguousStreakStats: {
    noHighsStreaks: ContiguousStreakStats
    noHighsOrLowsStreaks: ContiguousStreakStats
    noLowsStreaks: ContiguousStreakStats
  }
}
