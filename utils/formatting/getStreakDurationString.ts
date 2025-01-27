import prettyMilliseconds from 'pretty-ms'
import type { GlucoseRecord } from '~/types/glucoseRecord'

export const getStreakDurationString = (longestStreak: GlucoseRecord[]): string => {
  const streakStart = longestStreak[0]?.created
  const streakEnd = longestStreak[longestStreak.length - 1]?.created
  const startDate = streakStart
  const endDate = streakEnd

  const startTime = startDate && startDate.getTime()
  const endTime = endDate && endDate.getTime()

  const streakDuration = startTime && endTime && Math.abs(startTime - endTime)

  return streakDuration ? prettyMilliseconds(streakDuration) : 'No streak'
}
