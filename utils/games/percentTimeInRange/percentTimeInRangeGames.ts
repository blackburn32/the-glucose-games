import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { filterRecordsByTimePeriod } from '~/utils/filters/timePeriod/filterByTimePeriod'
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import type { ScoredDay } from '~/types/scoredDay'
import { CurrentDayStatus } from '~/types/constants'
import { calculateDailyStreakStats } from '~/utils/streaks/dailyStreaks'
import { cleanPercentForDisplay } from '~/utils/formatting/percentFormatting'

export const percentTimeInRangeGame = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  startHour: number,
  startMinutes: number,
  endHour: number,
  endMinutes: number,
  streakFilterValue: number,
) => {
  const filterFunction = (records: GlucoseRecord[]) => {
    return filterRecordsByTimePeriod(records, startHour, startMinutes, endHour, endMinutes)
  }
  const dailyScoringFunction = (records: GlucoseRecord[]) => {
    return scoreRecordsByPercentTimeInRange(records, thresholds)
  }
  const getCurrentDayStatus = (currentDay: ScoredDay) => {
    const today = new Date()
    const currentlyPastEndTime = today.getHours() > endHour || (today.getHours() === endHour && today.getMinutes() >= endMinutes)
    if (currentDay.passesThreshold) {
      return CurrentDayStatus.Pass
    }
    if (currentlyPastEndTime) {
      return CurrentDayStatus.Fail
    }
    return CurrentDayStatus.Pending
  }
  const scorePassesStreakCheck = (score: number) => score >= streakFilterValue

  return calculateDailyStreakStats(
    records,
    filterFunction,
    dailyScoringFunction,
    scorePassesStreakCheck,
    getCurrentDayStatus,
    cleanPercentForDisplay,
  )
}

export const percentTimeInRangeForFullDayStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  streakFilterValue: number,
) => {
  return percentTimeInRangeGame(records, thresholds, 0, 0, 23, 59, streakFilterValue)
}

export const percentTimeInRangeForNightsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  streakFilterValue: number,
) => {
  return percentTimeInRangeGame(records, thresholds, 0, 0, 5, 59, streakFilterValue)
}

export const percentTimeInRangeForMorningsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  streakFilterValue: number,
) => {
  return percentTimeInRangeGame(records, thresholds, 6, 0, 11, 59, streakFilterValue)
}

export const percentTimeInRangeForAfternoonsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  streakFilterValue: number,
) => {
  return percentTimeInRangeGame(records, thresholds, 12, 0, 17, 59, streakFilterValue)
}

export const percentTimeInRangeForEveningsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  streakFilterValue: number,
) => {
  return percentTimeInRangeGame(records, thresholds, 18, 0, 23, 59, streakFilterValue)
}
