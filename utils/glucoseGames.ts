import type { GlucoseRecord } from '~/types/glucoseRecord'
import { CurrentDayStatus } from '~/types/constants'
import { getStreakDurationString } from '~/utils/formatting/getStreakDurationString'
import type { ScoredDay } from '~/types/scoredDay'
import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import type { DailyStreakStats } from '~/types/dailyStreakStats'

const groupRecordsByDay = (records: GlucoseRecord[]): { [day: string]: GlucoseRecord[] } => {
  return records.reduce((acc, record) => {
    const day = record.created.toLocaleString().split(',')[0]
    acc[day] = acc[day] || []
    acc[day].push(record)
    return acc
  }, {} as { [day: string]: GlucoseRecord[] })
}

export const cleanPercentForDisplay = (percentTimeInRange: number) => {
  if (!percentTimeInRange) return '0.00'
  return percentTimeInRange.toFixed(2)
}

const splitRecordsIntoContiguousStreaks = (
  records: GlucoseRecord[],
  recordIncludedInStreak: (record: GlucoseRecord) => boolean,
) => {
  const streaks: GlucoseRecord[][] = []
  let currentStreak: GlucoseRecord[] = []

  for (const record of records) {
    if (recordIncludedInStreak(record)) {
      currentStreak.push(record)
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

  return streaks
}

export const calculateContiguousStreakStats: (
  records: GlucoseRecord[],
  recordIncludedInStreak: (record: GlucoseRecord) => boolean
) => ContiguousStreakStats = (
  records: GlucoseRecord[],
  recordIncludedInStreak: (record: GlucoseRecord) => boolean,
) => {
  const streaks = splitRecordsIntoContiguousStreaks(records, recordIncludedInStreak)

  const longestStreak = streaks.reduce((longest, streak) => {
    return streak.length > longest.length ? streak : longest
  }, [] as GlucoseRecord[])
  const longestStreakString = getStreakDurationString(longestStreak)

  const currentStreak = streaks.at(-1) || []
  const currentStreakString = getStreakDurationString(currentStreak)

  const lastRecord = records.at(-1)
  const currentlyInStreak = lastRecord && recordIncludedInStreak(lastRecord)

  const streakStringToDisplay = currentlyInStreak ? currentStreakString : 'Not in range'

  return {
    longestStreak,
    longestStreakString,
    currentStreak,
    currentStreakString,
    currentlyInStreak: !!currentStreak,
    streaks,
    streakStringToDisplay,
  }
}

const getStreakDates = (
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
    }
  })
}

export const calculateDailyStreakStats: (
  records: GlucoseRecord[],
  filterFunction: (records: GlucoseRecord[]) => GlucoseRecord[],
  dailyScoringFunction: (records: GlucoseRecord[]) => number,
  scorePassesStreakCheck: (score: number) => boolean,
  includeCurrentDay: (scoredDays: ScoredDay) => CurrentDayStatus,
  scoreDisplayFunction?: (score: number) => string
) => DailyStreakStats = (
  records: GlucoseRecord[],
  filterFunction: (records: GlucoseRecord[]) => GlucoseRecord[],
  dailyScoringFunction: (records: GlucoseRecord[]) => number,
  scorePassesStreakCheck: (score: number) => boolean,
  includeCurrentDay: (scoredDays: ScoredDay) => CurrentDayStatus,
  scoreDisplayFunction?: (score: number) => string,
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
        return day.score > best.score ? day : best
      })
    : undefined

  const today = new Date().toLocaleString().split(',')[0]
  const todaysScoredDay = scoredDays.find(day => day.date.toLocaleString().split(',')[0] === today)

  const mostRecentScoredDay = scoredDays.at(-1)

  const currentStreak = getCurrentDailyStreak(todaysScoredDay, scoredDays, includeCurrentDay)

  const bestStreak = getBestDailyStreak(scoredDays)
  const bestStreakIncludesToday = todaysScoredDay ? bestStreak.includes(todaysScoredDay) : false

  const streakDates = getStreakDates(scoredDays)

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
    streakDates,
  }
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

  if (currentDayStatus === CurrentDayStatus.Pass && today) {
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
