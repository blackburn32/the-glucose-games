import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { scoreRecordsByAverageGlucose } from '~/utils/scoring/averageGlucoseValue/averageGlucoseValue'
import { filterRecordsByTimePeriod } from '~/utils/filters/timePeriod/filterByTimePeriod'
import type { ScoredDay } from '~/types/scoredDay'
import { CurrentDayStatus, SemanticPeriods } from '~/types/constants'
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
  const tenPercentMargin = thresholds.target * 0.1
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
    const aDiff = Math.abs(a.score - thresholds.target)
    const bDiff = Math.abs(b.score - thresholds.target)
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

export const averageInRangeForSemanticPeriods = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
) => {
  return Object.fromEntries(SemanticPeriods.map((period) => {
    return [period.id, averageInRangeGame(records, thresholds, period.startHour, period.startMinutes, period.endHour, period.endMinutes)]
  }))
}
