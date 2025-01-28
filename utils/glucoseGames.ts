import type { GlucoseRecord } from '~/types/glucoseRecord'
import { CurrentDayStatus } from '~/types/constants'
import { getStreakDurationString } from '~/utils/formatting/getStreakDurationString'
import type { ScoredDay } from '~/types/scoredDay'

const groupRecordsByDay = (records: GlucoseRecord[]): { [day: string]: GlucoseRecord[] } => {
  return records.reduce((acc, record) => {
    const day = record.created.toLocaleString().split(',')[0]
    acc[day] = acc[day] || []
    acc[day].push(record)
    return acc
  }, {} as { [day: string]: GlucoseRecord[] })
}

const getCurrentStreak = (
  records: GlucoseRecord[],
  filter: (record: GlucoseRecord) => boolean,
) => {
  const streak: GlucoseRecord[] = []

  for (let i = records.length - 1; i >= 0; i--) {
    const record = records[i]
    if (filter(record)) {
      streak.push(record)
    }
    else {
      break
    }
  }

  const streakString = getStreakDurationString(streak)

  return {
    longestStreak: streak.reverse(),
    streakString,
  }
}

const getLongestStreak = (
  records: GlucoseRecord[],
  filter: (record: GlucoseRecord) => boolean,
): {
  longestStreak: GlucoseRecord[]
  streakString: string
} => {
  let longestStreak: GlucoseRecord[] = []
  let currentStreak: GlucoseRecord[] = []
  for (const record of records) {
    if (filter(record)) {
      currentStreak.push(record)
    }
    else {
      if (currentStreak.length > longestStreak.length) {
        longestStreak = currentStreak
      }
      currentStreak = []
    }
  }
  if (currentStreak.length > longestStreak.length) {
    longestStreak = currentStreak
  }

  const streakString = getStreakDurationString(longestStreak)

  return { longestStreak, streakString }
}

export const longestStreakWithoutLowsOrHighs = (
  records: GlucoseRecord[],
  lowThreshold: number,
  highThreshold: number,
  current: boolean = false,
) => {
  const filter = (record: GlucoseRecord) => record.value > lowThreshold && record.value < highThreshold
  return current
    ? getCurrentStreak(records, filter)
    : getLongestStreak(records, filter)
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

export const calculateContiguousStreakStats = (
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
    currentlyInStreak,
    streaks,
    streakStringToDisplay,
  }
}

export const calculateDailyStreakStats = (
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
  })

  const bestDay = scoredDays.reduce((best, day) => {
    return day.score > best.score ? day : best
  })

  const today = new Date().toLocaleString().split(',')[0]
  const todaysScoredDay = scoredDays.find(day => day.date.toLocaleString().split(',')[0] === today) || {
    date: new Date(),
    glucoseRecords: [],
    score: 0,
    scoreForDisplay: '0',
    passesThreshold: false,
  }

  const mostRecentScoredDay = scoredDays.at(-1)

  const currentStreak = getCurrentDailyStreak(todaysScoredDay, scoredDays, includeCurrentDay)

  const bestStreak = getBestDailyStreak(scoredDays)
  const bestStreakIncludesToday = todaysScoredDay ? bestStreak.includes(todaysScoredDay) : false

  return {
    bestDay,
    bestStreak,
    bestStreakIncludesToday,
    currentStreak,
    scoredDays,
    todaysScoredDay,
    mostRecentScoredDay,
  }
}

const getCurrentDailyStreak = (
  today: ScoredDay,
  sortedScoredDays: ScoredDay[],
  getCurrentDayStatus: (currentDay: ScoredDay) => CurrentDayStatus,
) => {
  const currentStreak: ScoredDay[] = []
  const currentDayStatus = getCurrentDayStatus(today)

  if (currentDayStatus === CurrentDayStatus.Fail) {
    return {
      scoredDays: currentStreak,
      currentDayStatus,
    }
  }

  if (currentDayStatus === CurrentDayStatus.Pass) {
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
