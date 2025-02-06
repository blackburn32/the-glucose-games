import type { ScoredDay } from '~/types/scoredDay'
import type { CurrentDayStatus } from '~/types/constants'

export type DailyStreakStats = {
  bestDay: ScoredDay | undefined
  bestStreak: ScoredDay[]
  bestStreakIncludesToday: boolean
  currentScoredDayWithFallback: ScoredDay | undefined
  currentStreak: {
    scoredDays: ScoredDay[]
    currentDayStatus: CurrentDayStatus
  }
  scoredDays: ScoredDay[]
  todaysScoredDay: ScoredDay | undefined
  mostRecentScoredDay: ScoredDay | undefined
  streaks: { start: Date | undefined, end: Date | undefined, streak: ScoredDay[] }[]
}
