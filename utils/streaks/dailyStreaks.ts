import parser from 'any-date-parser'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { ScoredDay } from '~/types/scoredDay'
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import { CurrentDayStatus, ONE_DAY } from '~/types/constants'
import { groupRecordsByDay } from '~/utils/records/groupRecords'
import { ScoreCheckResult } from '~/types/scoreCheckResult'

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

  const acceptableStatuses = [CurrentDayStatus.Pass]

  if (acceptableStatuses.includes(currentDayStatus) && today) {
    currentStreak.push(today)
  }

  for (let i = sortedScoredDays.length - 2; i >= 0; i--) {
    const day = sortedScoredDays[i]
    if (day.scoreResult === ScoreCheckResult.Pass) {
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

const addEmptyScoredDaysForMissingDays = (
  scoredDays: ScoredDay[],
  startDate: Date,
  endDate: Date,
) => {
  const days = []
  let currentDate = new Date(startDate)
  while (currentDate.getTime() <= endDate.getTime()) {
    const day = scoredDays.find((scoredDay) => {
      return scoredDay.date.toDateString() === currentDate.toDateString()
    })
    if (day) {
      days.push(day)
    }
    else {
      days.push({
        date: parser.fromAny(currentDate),
        glucoseRecords: [],
        score: 0,
        scoreResult: ScoreCheckResult.Missing,
        scoreForDisplay: '0',
        passesThreshold: false,
        medal: undefined,
      })
    }
    currentDate = parser.fromAny(currentDate.getTime() + ONE_DAY)
  }
  return days
}

export const calculateDailyStreakStats: (
  records: GlucoseRecord[],
  filterFunction: (records: GlucoseRecord[]) => GlucoseRecord[],
  dailyScoringFunction: (records: GlucoseRecord[]) => number,
  scoreResultCheck: (score: number) => ScoreCheckResult,
  includeCurrentDay: (scoredDays: ScoredDay) => CurrentDayStatus,
  scoreDisplayFunction?: (score: number) => string,
  bestDayComparisonFunction?: (a: ScoredDay, b: ScoredDay) => ScoredDay
) => DailyStreakStats = (
  records: GlucoseRecord[],
  filterFunction: (records: GlucoseRecord[]) => GlucoseRecord[],
  dailyScoringFunction: (records: GlucoseRecord[]) => number,
  scoreResultCheck: (score: number) => ScoreCheckResult,
  currentDayStatus: (scoredDays: ScoredDay) => CurrentDayStatus,
  scoreDisplayFunction?: (score: number) => string,
  bestDayComparisonFunction?: (a: ScoredDay, b: ScoredDay) => ScoredDay,
) => {
  const filteredRecords = filterFunction(records)

  const recordsByDay = groupRecordsByDay(filteredRecords)
  const dateStrings = Object.keys(recordsByDay)
  const startDate = parser.fromAny(dateStrings[0])
  const endDate = new Date()

  const scoredDaysWithPotentiallyMissingDates: ScoredDay[] = dateStrings.map((day) => {
    const date = parser.fromAny(day)
    const glucoseRecords = recordsByDay[day]
    const score = dailyScoringFunction(glucoseRecords)
    const scoreResult = scoreResultCheck(score)
    return {
      date,
      glucoseRecords,
      score,
      scoreResult,
      scoreForDisplay: scoreDisplayFunction ? scoreDisplayFunction(score) : score.toString(),
      passesThreshold: scoreResult === ScoreCheckResult.Pass,
      medal: undefined,
    }
  }).sort((a, b) => a.date.getTime() - b.date.getTime())

  const scoredDays = addEmptyScoredDaysForMissingDays(scoredDaysWithPotentiallyMissingDates, startDate, endDate)

  const bestDay = scoredDays.length > 0
    ? scoredDays.reduce((best, day) => {
        if (bestDayComparisonFunction) {
          return bestDayComparisonFunction(day, best)
        }
        return day.score > best.score ? day : best
      })
    : undefined

  const today = new Date().toDateString()
  const todaysScoredDay = scoredDays.find(day => day.date.toDateString() === today)

  const mostRecentScoredDay = scoredDays.at(-1)

  const currentStreak = getCurrentDailyStreak(todaysScoredDay, scoredDays, currentDayStatus)

  const bestStreak = getBestDailyStreak(scoredDaysWithPotentiallyMissingDates)
  const bestStreakIncludesToday = todaysScoredDay ? bestStreak.includes(todaysScoredDay) : false

  const streaks = getStreaks(scoredDaysWithPotentiallyMissingDates)

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
