import { CurrentDayStatus, SemanticPeriods } from '~/types/constants'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { ScoreCheckResult } from '~/types/scoreCheckResult'
import type { ScoredDay } from '~/types/scoredDay'
import type { Thresholds } from '~/types/thresholds'
import { filterRecordsByTimePeriod } from '~/utils/filters/timePeriod/filterByTimePeriod'
import { calculateDailyStreakStats } from '~/utils/streaks/dailyStreaks'

export const tallyGame = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  startHour: number,
  startMinutes: number,
  endHour: number,
  endMinutes: number,
  tallyFunction: (recordsForPeriod: GlucoseRecord[], thresholds: Thresholds) => number,
  target: number,
  targetAbove: boolean,
) => {
  const tenPercentMargin = thresholds.target * 0.1
  const filterFunction = (records: GlucoseRecord[]) => {
    return filterRecordsByTimePeriod(records, startHour, startMinutes, endHour, endMinutes)
  }
  const dailyScoringFunction = (records: GlucoseRecord[]) => {
    return tallyFunction(records, thresholds)
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
    if (targetAbove) {
      if (score >= target)
        return ScoreCheckResult.Pass
      else if (score >= target - tenPercentMargin)
        return ScoreCheckResult.Almost
      else
        return ScoreCheckResult.Fail
    }
    else {
      if (score <= target)
        return ScoreCheckResult.Pass
      else if (score <= target + tenPercentMargin)
        return ScoreCheckResult.Almost
      else
        return ScoreCheckResult.Fail
    }
  }

  const scoreDisplayFunction = (score: number) => {
    return score.toString()
  }

  const bestDayComparisonFunction = (a: ScoredDay, b: ScoredDay) => {
    const aIsAboveB = a.score > b.score
    if (targetAbove) {
      return aIsAboveB ? a : b
    }
    else {
      return aIsAboveB ? b : a
    }
  }

  return calculateDailyStreakStats(
    records,
    filterFunction,
    dailyScoringFunction,
    scoreResultCheck,
    getCurrentDayStatus,
    scoreDisplayFunction,
    bestDayComparisonFunction,
  )
}

export const tallyGameForSemanticPeriods = (
  records: GlucoseRecord[],
  thresholds: Thresholds,
  tallyFunction: (recordsForPeriod: GlucoseRecord[], thresholds: Thresholds) => number,
  target: number,
  targetAbove: boolean,
) => {
  return Object.fromEntries(SemanticPeriods.map((period) => {
    return [period.id, tallyGame(records, thresholds, period.startHour, period.startMinutes, period.endHour, period.endMinutes, tallyFunction, target, targetAbove)]
  }))
}
