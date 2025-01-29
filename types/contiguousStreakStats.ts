import type { GlucoseRecord } from '~/types/glucoseRecord'

export type ContiguousStreakStats = {
  longestStreak: GlucoseRecord[]
  longestStreakString: string
  currentStreak: GlucoseRecord[]
  currentStreakString: string
  currentlyInStreak: boolean
  streaks: GlucoseRecord[][]
  streakStringToDisplay: string
}
