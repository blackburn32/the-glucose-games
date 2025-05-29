import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { filterRecordsByTimePeriod } from '~/utils/filters/timePeriod/filterByTimePeriod'
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import type { ScoredDay } from '~/types/scoredDay'
import { CurrentDayStatus, SemanticPeriods, WeeklyTimePeriods } from '~/types/constants'
import { calculateDailyStreakStats } from '~/utils/streaks/dailyStreaks'
import { cleanPercentForDisplay } from '~/utils/formatting/percentFormatting'
import { ScoreCheckResult } from '~/types/scoreCheckResult'
import type { TimeBasedDailyStreaks } from '~/types/timeBasedDailyStreaks'

export const percentTimeInRangeGame = (
  records: GlucoseRecord[],
  recordsGroupedByDay: Record<string, GlucoseRecord[]>,
  thresholds: Thresholds,
  startHour: number,
  startMinutes: number,
  endHour: number,
  endMinutes: number,
) => {
  const tenPercentMargin = 10
  const filterFunction = (records: GlucoseRecord[]) => {
    return filterRecordsByTimePeriod(records, startHour, startMinutes, endHour, endMinutes)
  }
  const dailyScoringFunction = (records: GlucoseRecord[]) => {
    return scoreRecordsByPercentTimeInRange(records, thresholds)
  }
  const getCurrentDayStatus = (currentDay: ScoredDay) => {
    const today = new Date()
    const currentlyPastEndTime = today.getHours() > endHour || (today.getHours() === endHour && today.getMinutes() >= endMinutes)
    if (currentlyPastEndTime && currentDay.passesThreshold) {
      return CurrentDayStatus.Pass
    }
    if (currentlyPastEndTime) {
      return CurrentDayStatus.Fail
    }
    return CurrentDayStatus.Pending
  }
  const scoreResultCheck = (score: number) => {
    if (score >= thresholds.dailyStreakPercentTimeInRange)
      return ScoreCheckResult.Pass
    else if (score >= thresholds.dailyStreakPercentTimeInRange - tenPercentMargin)
      return ScoreCheckResult.Almost
    else
      return ScoreCheckResult.Fail
  }

  return calculateDailyStreakStats(
    records,
    recordsGroupedByDay,
    filterFunction,
    dailyScoringFunction,
    scoreResultCheck,
    getCurrentDayStatus,
    cleanPercentForDisplay,
  )
}

export const percentTimeInRangeForEveryFourHourPeriod = (
  records: GlucoseRecord[],
  recordsGroupedByDay: Record<string, GlucoseRecord[]>,
  thresholds: Thresholds,
): TimeBasedDailyStreaks => {
  return Object.fromEntries(WeeklyTimePeriods.map((period) => {
    return [period.name, percentTimeInRangeGame(
      records,
      recordsGroupedByDay,
      thresholds,
      period.startHour,
      period.startMinutes,
      period.endHour,
      period.endMinutes,
    )]
  }))
}

export const percentTimeInRangeForSemanticPeriods = (
  records: GlucoseRecord[],
  recordsGroupedByDay: Record<string, GlucoseRecord[]>,
  thresholds: Thresholds,
): TimeBasedDailyStreaks => {
  return Object.fromEntries(SemanticPeriods.map((period) => {
    return [period.id, percentTimeInRangeGame(
      records,
      recordsGroupedByDay,
      thresholds,
      period.startHour,
      period.startMinutes,
      period.endHour,
      period.endMinutes,
    )]
  }))
}
