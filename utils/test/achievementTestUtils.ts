import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import { CurrentDayStatus } from '~/types/constants'
import type { ScoredDay } from '~/types/scoredDay'

export const createEmptyContiguousStreakStats = (): ContiguousStreakStats => ({
  longestStreak: [],
  longestStreakString: '0 minutes',
  currentStreak: [],
  currentStreakString: '0 minutes',
  currentlyInStreak: false,
  streaks: [],
  streakStringToDisplay: '0 minutes',
})

export const createEmptyStreakStats = () => ({
  noHighsStreaks: createEmptyContiguousStreakStats(),
  noHighsOrLowsStreaks: createEmptyContiguousStreakStats(),
  noLowsStreaks: createEmptyContiguousStreakStats(),
})

export const createEmptyDailyStreakStats = () => ({
  streaks: [],
  bestStreak: [],
  bestDay: undefined,
  bestStreakIncludesToday: false,
  currentScoredDayWithFallback: undefined,
  currentStreak: { scoredDays: [], currentDayStatus: CurrentDayStatus.Pending },
  scoredDays: [],
  todaysScoredDay: undefined,
  mostRecentScoredDay: undefined,
})

export const createScoredDay = (date: Date, score: number, passesThreshold: boolean): ScoredDay => ({
  date,
  glucoseRecords: [],
  score,
  scoreForDisplay: `${score}%`,
  passesThreshold,
})

export const createDailyStreakStatsWithDay = (scoredDay: ScoredDay) => ({
  streaks: [{
    start: scoredDay.date,
    end: scoredDay.date,
    streak: [scoredDay],
  }],
  bestStreak: [scoredDay],
  bestDay: scoredDay,
  bestStreakIncludesToday: false,
  currentScoredDayWithFallback: scoredDay,
  currentStreak: {
    scoredDays: [scoredDay],
    currentDayStatus: CurrentDayStatus.Pending,
  },
  scoredDays: [scoredDay],
  todaysScoredDay: undefined,
  mostRecentScoredDay: scoredDay,
})

export const createDailyStreakStatsWithTwoDays = (firstDay: ScoredDay, secondDay: ScoredDay) => ({
  streaks: [{
    start: firstDay.date,
    end: secondDay.date,
    streak: [firstDay, secondDay],
  }],
  bestStreak: [firstDay, secondDay],
  bestDay: firstDay,
  bestStreakIncludesToday: false,
  currentScoredDayWithFallback: secondDay,
  currentStreak: {
    scoredDays: [firstDay, secondDay],
    currentDayStatus: CurrentDayStatus.Pending,
  },
  scoredDays: [firstDay, secondDay],
  todaysScoredDay: undefined,
  mostRecentScoredDay: secondDay,
})

export const createEmptyScoredGames = () => ({
  dailyStreakStats: {
    averageInRangeForFullDay: createEmptyDailyStreakStats(),
    averageInRangeForMornings: createEmptyDailyStreakStats(),
    averageInRangeForAfternoons: createEmptyDailyStreakStats(),
    averageInRangeForEvenings: createEmptyDailyStreakStats(),
    averageInRangeForNights: createEmptyDailyStreakStats(),
    percentTimeInRangeForFullDay: createEmptyDailyStreakStats(),
    percentTimeInRangeForMornings: createEmptyDailyStreakStats(),
    percentTimeInRangeForAfternoons: createEmptyDailyStreakStats(),
    percentTimeInRangeForEvenings: createEmptyDailyStreakStats(),
    percentTimeInRangeForNights: createEmptyDailyStreakStats(),
  },
  contiguousStreakStats: createEmptyStreakStats(),
})
