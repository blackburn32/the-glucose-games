import prettyMilliseconds from 'pretty-ms'
import type { GlucoseRecord } from '~/types/glucoseRecord'

export const getStreakDuration = (streak: GlucoseRecord[]) => {
  const streakStart = streak[0]?.created
  const streakEnd = streak[streak.length - 1]?.created
  const startDate = streakStart
  const endDate = streakEnd

  const startTime = startDate && startDate.getTime()
  const endTime = endDate && endDate.getTime()

  return startTime && endTime && Math.abs(startTime - endTime)
}

export const getStreakDurationString = (longestStreak: GlucoseRecord[]): string => {
  const streakDuration = getStreakDuration(longestStreak)
  return streakDuration ? prettyMilliseconds(streakDuration, { secondsDecimalDigits: 0 }) : 'No streak'
}
