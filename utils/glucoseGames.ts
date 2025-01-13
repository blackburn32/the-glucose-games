import prettyMilliseconds from 'pretty-ms'
import type { GlucoseRecord } from '~/types/types.ts'

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

  const streakStart = longestStreak[0]?.created
  const streakEnd = longestStreak[longestStreak.length - 1]?.created
  const startDate = streakStart && new Date(streakStart)
  const endDate = streakEnd && new Date(streakEnd)

  const startTime = startDate && startDate.getTime()
  const endTime = endDate && endDate.getTime()

  const streakDuration = startTime && endTime && (startTime - endTime)

  const streakString = streakDuration
    ? prettyMilliseconds(streakDuration)
    : 'No streak'

  return { longestStreak, streakString }
}

export const longestStreakWithoutLows = (
  records: GlucoseRecord[],
  lowThreshold: number,
) => getLongestStreak(records, record => record.value > lowThreshold)

export const longestStreakWithoutHighs = (
  records: GlucoseRecord[],
  highThreshold: number,
) => getLongestStreak(records, record => record.value < highThreshold)

export const longestStreakWithoutLowsOrHighs = (
  records: GlucoseRecord[],
  lowThreshold: number,
  highThreshold: number,
) => getLongestStreak(records, record => record.value > lowThreshold && record.value < highThreshold)
