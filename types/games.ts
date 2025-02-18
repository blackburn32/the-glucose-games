import type { DailyStreakStats } from '~/types/dailyStreakStats'

export type TieredDailyStreakGame = {
  easy: DailyStreakStats
  medium: DailyStreakStats
  hard: DailyStreakStats
}

export type AllTimingsAndTiersDailyStreakGame = {
  morning: TieredDailyStreakGame
  afternoon: TieredDailyStreakGame
  evening: TieredDailyStreakGame
  night: TieredDailyStreakGame
  fullDay: TieredDailyStreakGame
}
