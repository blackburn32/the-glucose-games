import prettyMilliseconds from 'pretty-ms'
import type { GlucoseRecord } from '~/types/types.ts'
import { CurrentDayStatus } from '~/types/constants.ts'

const groupRecordsByDay = (records: GlucoseRecord[]): { [day: string]: GlucoseRecord[] } => {
  return records.reduce((acc, record) => {
    const day = record.created.toISOString().split('T')[0]
    acc[day] = acc[day] || []
    acc[day].push(record)
    return acc
  }, {} as { [day: string]: GlucoseRecord[] })
}

const updateStreak = (
  day: string,
  dayFilter: (records: GlucoseRecord[]) => boolean,
  recordsByDay: { [day: string]: GlucoseRecord[] },
  currentStreak: number,
  longestStreak: { start: string | null, end: string | null, length: number },
): { currentStreak: number, longestStreak: { start: string | null, end: string | null, length: number } } => {
  if (dayFilter(recordsByDay[day])) {
    currentStreak++
    if (currentStreak > longestStreak.length) {
      longestStreak.start = longestStreak.start ?? day
      longestStreak.end = day
      longestStreak.length = currentStreak
    }
  }
  else {
    currentStreak = 0
  }

  return {
    currentStreak,
    longestStreak,
  }
}

const finalizeLongestStreak = (
  currentStreak: number,
  longestStreak: { start: string | null, end: string | null, length: number },
  lastDay: string | undefined,
): { start: string | null, end: string | null, length: number } => {
  if (currentStreak > longestStreak.length) {
    longestStreak.length = currentStreak
    longestStreak.end = lastDay ?? null
  }
  return longestStreak
}

const getDailyStreak = (records: GlucoseRecord[], dayFilter: (records: GlucoseRecord[]) => boolean) => {
  const recordsByDay = groupRecordsByDay(records)
  const sortedDays = Object.keys(recordsByDay).sort()

  let currentStreak = 0
  let longestStreak = {
    start: null,
    end: null,
    length: 0,
  }

  for (const day of sortedDays) {
    const result = updateStreak(day, dayFilter, recordsByDay, currentStreak, longestStreak)
    currentStreak = result.currentStreak
    longestStreak = result.longestStreak
  }

  longestStreak = finalizeLongestStreak(currentStreak, longestStreak, sortedDays[sortedDays.length - 1])

  return {
    longestStreak: longestStreak.length,
    longestStreakStart: longestStreak.start,
    longestStreakEnd: longestStreak.end,
  }
}

const getCurrentDailyStreak = (
  records: GlucoseRecord[],
  dayFilter: (records: GlucoseRecord[]) => boolean,
  getStatusForToday?: (records: GlucoseRecord[]) => CurrentDayStatus,
) => {
  const recordsByDay = groupRecordsByDay(records)
  const daysInReverse = Object.keys(recordsByDay).sort().reverse()

  const lastRecord = daysInReverse.pop()
  const todaysRecords = recordsByDay[lastRecord]

  const statusForToday = todaysRecords && getStatusForToday ? getStatusForToday(todaysRecords) : CurrentDayStatus.Pending

  const streak: string[] = statusForToday === CurrentDayStatus.Pass
    ? [lastRecord]
    : []

  for (const day of daysInReverse) {
    if (dayFilter(recordsByDay[day])) {
      streak.push(day)
    }
    else {
      break
    }
  }

  return {
    streak,
    statusForToday,
  }
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

  const streakString = calculateStreakString(streak)

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

  const streakString = calculateStreakString(longestStreak)

  return { longestStreak, streakString }
}

const calculateStreakString = (longestStreak: GlucoseRecord[]): string => {
  const streakStart = longestStreak[0]?.created
  const streakEnd = longestStreak[longestStreak.length - 1]?.created
  const startDate = streakStart
  const endDate = streakEnd

  const startTime = startDate && startDate.getTime()
  const endTime = endDate && endDate.getTime()

  const streakDuration = startTime && endTime && Math.abs(startTime - endTime)

  return streakDuration ? prettyMilliseconds(streakDuration) : 'No streak'
}

const calculateBestDay = (records: GlucoseRecord[], dayScore: (records: GlucoseRecord[]) => number) => {
  const recordsByDay = groupRecordsByDay(records)
  return Object.keys(recordsByDay).reduce((best, day) => {
    const score = dayScore(recordsByDay[day])
    return score > best.score
      ? {
          day: recordsByDay[day],
          score,
        }
      : best
  },
  {
    day: [] as GlucoseRecord[],
    score: 0,
  },
  )
}

const calculateBestDayWithTimeRange = (
  records: GlucoseRecord[],
  timeStart: number,
  timeEnd: number,
  dayScore: (records: GlucoseRecord[]) => number,
) => {
  const recordsByDay = groupRecordsByDay(records)
  return Object.keys(recordsByDay).reduce((best, day) => {
    const recordsInTimeRange = recordsByDay[day].filter((record) => {
      const recordTime = record.created.getHours()
      return recordTime >= timeStart && recordTime <= timeEnd
    })
    const score = dayScore(recordsInTimeRange)
    return score > best.score
      ? {
          day: recordsByDay[day],
          score,
        }
      : best
  },
  {
    day: [] as GlucoseRecord[],
    score: 0,
  },
  )
}

export const longestStreakWithoutLows = (
  records: GlucoseRecord[],
  lowThreshold: number,
  current: boolean = false,
) => {
  const filter = (record: GlucoseRecord) => record.value > lowThreshold
  return current
    ? getCurrentStreak(records, filter)
    : getLongestStreak(records, filter)
}

export const longestStreakWithoutHighs = (
  records: GlucoseRecord[],
  highThreshold: number,
  current: boolean = false,
) => {
  const filter = record => record.value < highThreshold
  return current
    ? getCurrentStreak(records, filter)
    : getLongestStreak(records, filter)
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

const dayWithinRangeFilter = (
  day: GlucoseRecord[],
  percentInRange: number,
  lowThreshold: number,
  highThreshold: number,
) => {
  const withinRangeRecords = day.filter(record => record.value > lowThreshold && record.value < highThreshold)
  return (withinRangeRecords.length / day.length) >= (percentInRange / 100)
}

export const longestDayStreakWithinRange = (
  records: GlucoseRecord[],
  percentInRange: number,
  lowThreshold: number,
  highThreshold: number,
) => {
  return getDailyStreak(records, day => dayWithinRangeFilter(day, percentInRange, lowThreshold, highThreshold))
}

export const currentDayStreakWithinRange = (
  records: GlucoseRecord[],
  percentInRange: number,
  lowThreshold: number,
  highThreshold: number,
) => {
  return getCurrentDailyStreak(
    records,
    day => dayWithinRangeFilter(day, percentInRange, lowThreshold, highThreshold),
    (day) => {
      const withinRange = dayWithinRangeFilter(day, percentInRange, lowThreshold, highThreshold)
      return withinRange ? CurrentDayStatus.Pass : CurrentDayStatus.Pending
    },
  )
}

export const longestDailyAverageStreak = (
  records: GlucoseRecord[],
  lowThreshold: number,
  highThreshold: number,
) => {
  const dayFilter = (day: GlucoseRecord[]) => {
    const average = day.reduce((sum, record) => sum + record.value, 0) / day.length
    return average > lowThreshold && average < highThreshold
  }
  return getDailyStreak(records, dayFilter)
}

export const currentDailyAverageStreak = (
  records: GlucoseRecord[],
  lowThreshold: number,
  highThreshold: number,
) => {
  const dayFilter = (day: GlucoseRecord[]) => {
    const average = day.reduce((sum, record) => sum + record.value, 0) / day.length
    return average > lowThreshold && average < highThreshold
  }
  return getCurrentDailyStreak(
    records,
    dayFilter,
    (day) => {
      const average = day.reduce((sum, record) => sum + record.value, 0) / day.length
      return average > lowThreshold && average < highThreshold
        ? CurrentDayStatus.Pass
        : CurrentDayStatus.Pending
    },
  )
}

export const longestStreakOfDaysWithRecords = (
  records: GlucoseRecord[],
  recordsPerDay: number,
) => {
  const dayFilter = (day: GlucoseRecord[]) => day.length > recordsPerDay
  return getDailyStreak(records, dayFilter)
}

export const longestDailyStreakWithTimePeriodInRange = (
  records: GlucoseRecord[],
  timeStart: number,
  timeEnd: number,
  highThreshold: number,
  lowThreshold: number,
  percentInRange: number,
) => {
  const dayFilter = (day: GlucoseRecord[]) => {
    const recordsInTimeRange = day.filter((record) => {
      const recordTime = record.created.getHours()
      return recordTime >= timeStart && recordTime <= timeEnd
    })

    const withinRangeRecords
        = recordsInTimeRange.filter(
          record =>
            record.value > lowThreshold
            && record.value < highThreshold,
        )

    return (withinRangeRecords.length / recordsInTimeRange.length) >= (percentInRange / 100)
  }
  return getDailyStreak(records, dayFilter)
}

const percentTimeInRangeDayFilter = (
  day: GlucoseRecord[],
  thresholds: { low: number, high: number },
) => {
  const timeInRange = day.filter(record => record.value > thresholds.low && record.value < thresholds.high)
  return (timeInRange.length / day.length) * 100
}

export const getBestDayByPercentTimeInRange = (
  records: GlucoseRecord[],
  thresholds: { low: number, high: number },
) => {
  return calculateBestDay(records, day => percentTimeInRangeDayFilter(day, thresholds))
}

export const getBestDayByPercentTimeInRangeWithTimeRange = (
  records: GlucoseRecord[],
  thresholds: { low: number, high: number },
  timeStart: number,
  timeEnd: number,
) => {
  return calculateBestDayWithTimeRange(records, timeStart, timeEnd, day => percentTimeInRangeDayFilter(day, thresholds))
}

export const currentDailyStreakWithTimePeriodInRange = (
  records: GlucoseRecord[],
  timeStart: number,
  timeEnd: number,
  lowThreshold: number,
  highThreshold: number,
  percentInRange: number,
) => {
  const dayFilter = (day: GlucoseRecord[]) => {
    const recordsInTimeRange = day.filter((record) => {
      const recordTime = record.created.getHours()
      return recordTime >= timeStart && recordTime <= timeEnd
    })

    const withinRangeRecords
              = recordsInTimeRange.filter(
                record =>
                  record.value > lowThreshold
                  && record.value < highThreshold,
              )

    return (withinRangeRecords.length / recordsInTimeRange.length) >= (percentInRange / 100)
  }
  return getCurrentDailyStreak(
    records,
    dayFilter,
    (day) => {
      const now = new Date().getHours()
      if (now < timeStart || now > timeEnd) {
        return CurrentDayStatus.Pending
      }
      const withinRange = dayFilter(day)
      return withinRange ? CurrentDayStatus.Pass : CurrentDayStatus.Fail
    },
  )
}

export const longestDailyStreakWithoutGaps = (
  records: GlucoseRecord[],
  gapThreshold: number,
) => {
  const dayFilter = (day: GlucoseRecord[]) => {
    const timestamps = day.map(record => record.created.getTime()).sort((a, b) => a - b)
    for (let i = 1; i < timestamps.length; i++) {
      if ((timestamps[i] - timestamps[i - 1]) > gapThreshold * 60 * 1000) {
        return false
      }
    }

    const firstRecordOfDay = timestamps[0]
    const lastRecordOfDay = timestamps[timestamps.length - 1]
    const startOfDay = new Date(timestamps[0]).setHours(0, 0, 0, 0)
    const endOfDay = new Date(timestamps[0]).setHours(23, 59, 59, 999)

    return (firstRecordOfDay - startOfDay) > gapThreshold * 60 * 1000
      && (endOfDay - lastRecordOfDay) <= gapThreshold * 60 * 1000
  }
  return getDailyStreak(records, dayFilter)
}

export const calculatePercentTimeInRange = (records: GlucoseRecord[], thresholds: { low: number, high: number }) => {
  if (!records) return 0
  const timeInRange = records.filter(record => record.value > thresholds.low && record.value < thresholds.high)
  return ((timeInRange.length / records.length) * 100)
}

export const cleanPercentForDisplay = (percentTimeInRange: number) => {
  if (!percentTimeInRange) return 0
  return percentTimeInRange.toFixed(2)
}
