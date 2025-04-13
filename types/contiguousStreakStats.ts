import type { GlucoseRecord } from '~/types/glucoseRecord'

export type ContiguousStreakStats = {
  title: string
  longestStreak: GlucoseRecord[]
  longestStreakString: string
  currentStreak: GlucoseRecord[]
  currentStreakString: string
  currentlyInStreak: boolean
  streaks: GlucoseRecord[][]
  streakStringToDisplay: string
  high?: number | undefined
  low?: number | undefined
}
