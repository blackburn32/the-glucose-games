import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { ContiguousStreakStats } from '~/types/contiguousStreakStats'
import { getStreakDurationString } from '~/utils/formatting/getStreakDurationString'

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