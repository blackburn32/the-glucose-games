import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { ScoredDay } from '~/types/scoredDay'
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { CurrentDayStatus } from '~/types/constants'
import { groupRecordsByDay } from '~/utils/records/groupRecords'

const getStreaks = (
  scoredDays: ScoredDay[],
) => {
  const sortedDays = scoredDays.slice().sort((a, b) => a.date.getTime() - b.date.getTime())
  const streaks: ScoredDay[][] = []
  let currentStreak: ScoredDay[] = []

  for (const day of sortedDays) {
    if (day.passesThreshold) {
      currentStreak.push(day)
    }
    else {
      if (currentStreak.length) {
        streaks.push(currentStreak)
        currentStreak = []
      }
    }
  }

  if (currentStreak.length) {
    streaks.push(currentStreak)
  }

  return streaks.map((streak) => {
    return {
      start: streak[0].date,
      end: streak.at(-1)?.date,
      streak,
    }
  })
}

const getCurrentDailyStreak = (
  today: ScoredDay | undefined,
  sortedScoredDays: ScoredDay[],
  getCurrentDayStatus: (currentDay: ScoredDay) => CurrentDayStatus,
) => {
  const currentStreak: ScoredDay[] = []
  const currentDayStatus = today ? getCurrentDayStatus(today) : CurrentDayStatus.Pending

  if (currentDayStatus === CurrentDayStatus.Fail) {
    return {
      scoredDays: currentStreak,
      currentDayStatus,
    }
  }

  const acceptableStatuses = [CurrentDayStatus.Pass, CurrentDayStatus.Pending]

  if (acceptableStatuses.includes(currentDayStatus) && today) {
    currentStreak.push(today)
  }

  for (let i = sortedScoredDays.length - 2; i >= 0; i--) {
    const day = sortedScoredDays[i]
    if (day.passesThreshold) {
      currentStreak.push(day)
    }
    else {
      break
    }
  }
  return {
    scoredDays: currentStreak,
    currentDayStatus,
  }
}

const getBestDailyStreak = (sortedScoredDays: ScoredDay[]) => {
  let bestStreak: ScoredDay[] = []
  let currentStreak: ScoredDay[] = []
  for (const day of sortedScoredDays) {
    if (day.passesThreshold) {
      currentStreak.push(day)
    }
    else {
      if (currentStreak.length > bestStreak.length) {
        bestStreak = currentStreak
      }
      currentStreak = []
    }
  }
  if (currentStreak.length > bestStreak.length) {
    bestStreak = currentStreak
  }
  return bestStreak
}

export const calculateDailyStreakStats: (
  records: GlucoseRecord[],
  filterFunction: (records: GlucoseRecord[]) => GlucoseRecord[],
  dailyScoringFunction: (records: GlucoseRecord[]) => number,
  scorePassesStreakCheck: (score: number) => boolean,
  includeCurrentDay: (scoredDays: ScoredDay) => CurrentDayStatus,
  scoreDisplayFunction?: (score: number) => string,
  bestDayComparisonFunction?: (a: ScoredDay, b: ScoredDay) => ScoredDay
) => DailyStreakStats = (
  records: GlucoseRecord[],
  filterFunction: (records: GlucoseRecord[]) => GlucoseRecord[],
  dailyScoringFunction: (records: GlucoseRecord[]) => number,
  scorePassesStreakCheck: (score: number) => boolean,
  includeCurrentDay: (scoredDays: ScoredDay) => CurrentDayStatus,
  scoreDisplayFunction?: (score: number) => string,
  bestDayComparisonFunction?: (a: ScoredDay, b: ScoredDay) => ScoredDay,
) => {
  const filteredRecords = filterFunction(records)

  const recordsByDay = groupRecordsByDay(filteredRecords)
  const sortedDateStrings = Object.keys(recordsByDay).sort()

  const scoredDays: ScoredDay[] = sortedDateStrings.map((day) => {
    const date = new Date(day)
    const glucoseRecords = recordsByDay[day]
    const score = dailyScoringFunction(glucoseRecords)
    return {
      date,
      glucoseRecords,
      score,
      scoreForDisplay: scoreDisplayFunction ? scoreDisplayFunction(score) : score.toString(),
      passesThreshold: scorePassesStreakCheck(score),
    }
  }).sort((a, b) => a.date.getTime() - b.date.getTime())

  const bestDay = scoredDays.length > 0
    ? scoredDays.reduce((best, day) => {
        if (bestDayComparisonFunction) {
          return bestDayComparisonFunction(day, best)
        }
        return day.score > best.score ? day : best
      })
    : undefined

  const today = new Date().toLocaleString().split(',')[0]
  const todaysScoredDay = scoredDays.find(day => day.date.toLocaleString().split(',')[0] === today)

  const mostRecentScoredDay = scoredDays.at(-1)

  const currentStreak = getCurrentDailyStreak(todaysScoredDay, scoredDays, includeCurrentDay)

  const bestStreak = getBestDailyStreak(scoredDays)
  const bestStreakIncludesToday = todaysScoredDay ? bestStreak.includes(todaysScoredDay) : false

  const streaks = getStreaks(scoredDays)

  const currentScoredDayWithFallback = todaysScoredDay

  return {
    bestDay,
    bestStreak,
    bestStreakIncludesToday,
    currentScoredDayWithFallback,
    currentStreak,
    scoredDays,
    todaysScoredDay,
    mostRecentScoredDay,
    streaks,
  }
} 