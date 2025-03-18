import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { scoreRecordsByAverageGlucose } from '~/utils/scoring/averageGlucoseValue/averageGlucoseValue'
import { filterRecordsByTimePeriod } from '~/utils/filters/timePeriod/filterByTimePeriod'
import type { ScoredDay } from '~/types/scoredDay'
import { CurrentDayStatus } from '~/types/constants'
import { calculateDailyStreakStats } from '~/utils/streaks/dailyStreaks'
import { cleanPercentForDisplay } from '~/utils/formatting/percentFormatting'
import { ScoreCheckResult } from '~/types/scoreCheckResult'

export const averageInRangeGame = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  startHour: number,
  startMinutes: number,
  endHour: number,
  endMinutes: number,
) => {
  const targetBloodSugar = 110
  const tenPercentMargin = targetBloodSugar * 0.1
  const filterFunction = (records: GlucoseRecord[]) => {
    return filterRecordsByTimePeriod(records, startHour, startMinutes, endHour, endMinutes)
  }
  const dailyScoringFunction = (records: GlucoseRecord[]) => {
    return scoreRecordsByAverageGlucose(records)
  }
  const getCurrentDayStatus = (currentDay: ScoredDay) => {
    const today = new Date()
    const currentlyPastEndTime = today.getHours() > endHour || (today.getHours() === endHour && today.getMinutes() >= endMinutes)
    if (currentDay.passesThreshold && currentlyPastEndTime) {
      return CurrentDayStatus.Pass
    }
    if (currentlyPastEndTime) {
      return CurrentDayStatus.Fail
    }
    return CurrentDayStatus.Pending
  }
  const scoreResultCheck = (score: number) => {
    if (score >= thresholds.low && score <= thresholds.high)
      return ScoreCheckResult.Pass
    else if (score >= thresholds.low - tenPercentMargin && score <= thresholds.high + tenPercentMargin)
      return ScoreCheckResult.Almost
    else
      return ScoreCheckResult.Fail
  }

  // Returns the day with a value closest to 100
  const bestDayComparisonFunction = (a: ScoredDay, b: ScoredDay) => {
    const aDiff = Math.abs(a.score - 100)
    const bDiff = Math.abs(b.score - 100)
    return aDiff < bDiff ? a : b
  }

  return calculateDailyStreakStats(
    records,
    filterFunction,
    dailyScoringFunction,
    scoreResultCheck,
    getCurrentDayStatus,
    cleanPercentForDisplay,
    bestDayComparisonFunction,
  )
}

export const averageInRangeForFullDayStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  return averageInRangeGame(records, thresholds, 0, 0, 23, 59)
}

export const averageInRangeForNightsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  return averageInRangeGame(records, thresholds, 0, 0, 5, 59)
}

export const averageInRangeForMorningsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  return averageInRangeGame(records, thresholds, 6, 0, 11, 59)
}

export const averageInRangeForAfternoonsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  return averageInRangeGame(records, thresholds, 12, 0, 17, 59)
}

export const averageInRangeForEveningsStreak = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  return averageInRangeGame(records, thresholds, 18, 0, 23, 59)
}
