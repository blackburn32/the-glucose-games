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

/**
 * Creates daily streak stats with multiple days. The days don't need to be consecutive.
 * Each day is treated as its own streak.
 */
export const createDailyStreakStatsWithMultipleDays = (scoredDays: ScoredDay[]) => {
  const sortedDays = [...scoredDays].sort((a, b) => a.date.getTime() - b.date.getTime())
  const streaks = sortedDays.map(day => ({
    start: day.date,
    end: day.date,
    streak: [day],
  }))

  return {
    streaks,
    bestStreak: sortedDays.length > 0 ? [sortedDays[0]] : [],
    bestDay: sortedDays.length > 0 ? sortedDays[0] : undefined,
    bestStreakIncludesToday: false,
    currentScoredDayWithFallback: sortedDays.length > 0 ? sortedDays[sortedDays.length - 1] : undefined,
    currentStreak: {
      scoredDays: sortedDays.length > 0 ? [sortedDays[sortedDays.length - 1]] : [],
      currentDayStatus: CurrentDayStatus.Pending,
    },
    scoredDays: sortedDays,
    todaysScoredDay: undefined,
    mostRecentScoredDay: sortedDays.length > 0 ? sortedDays[sortedDays.length - 1] : undefined,
  }
}

/**
 * Creates daily streak stats with multiple consecutive days as a single streak.
 * All days must be in order (oldest to newest) and are assumed to be consecutive.
 */
export const createDailyStreakStatsWithMultipleDaysStreak = (scoredDays: ScoredDay[]) => {
  if (scoredDays.length === 0) {
    return createEmptyDailyStreakStats()
  }

  const sortedDays = [...scoredDays].sort((a, b) => a.date.getTime() - b.date.getTime())

  return {
    streaks: [{
      start: sortedDays[0].date,
      end: sortedDays[sortedDays.length - 1].date,
      streak: sortedDays,
    }],
    bestStreak: sortedDays,
    bestDay: sortedDays[0],
    bestStreakIncludesToday: false,
    currentScoredDayWithFallback: sortedDays[sortedDays.length - 1],
    currentStreak: {
      scoredDays: sortedDays,
      currentDayStatus: CurrentDayStatus.Pending,
    },
    scoredDays: sortedDays,
    todaysScoredDay: undefined,
    mostRecentScoredDay: sortedDays[sortedDays.length - 1],
  }
}
