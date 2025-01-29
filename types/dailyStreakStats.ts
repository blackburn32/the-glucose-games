import type { ScoredDay } from '~/types/scoredDay'
import type { CurrentDayStatus } from '~/types/constants'

export type DailyStreakStats = {
  bestDay: ScoredDay
  bestStreak: ScoredDay[]
  bestStreakIncludesToday: boolean
  currentStreak: {
    scoredDays: ScoredDay[]
    currentDayStatus: CurrentDayStatus
  }
  scoredDays: ScoredDay[]
  todaysScoredDay: ScoredDay
  mostRecentScoredDay: ScoredDay | undefined
  streakDates: { start: Date | undefined, end: Date | undefined }[]
}
