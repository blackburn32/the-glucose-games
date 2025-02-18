import type { GlucoseRecord } from '~/types/glucoseRecord'
import { filterRecordsByTimePeriod } from '~/utils/filters/timePeriod/filterByTimePeriod'
import type { ScoredDay } from '~/types/scoredDay'
import { CurrentDayStatus } from '~/types/constants'
import { Trend } from '~/types/trend'
import { scoreRecordsByTrendControl } from '~/utils/scoring/trendControl/trendControl'
import { AfternoonTiming, EveningTiming, FullDayTiming, MorningTiming, NightTiming, type Timing } from '~/types/timing'
import type { AllTimingsAndTiersDailyStreakGame, TieredDailyStreakGame } from '~/types/games'

export const easyTrendControlUnacceptableTrends: Trend[] = [
  Trend.doubleUp,
  Trend.doubleDown,
  Trend.rateOutOfRange,
]

export const mediumTrendControlUnacceptableTrends: Trend[] = [
  ...easyTrendControlUnacceptableTrends,
  Trend.singleUp,
  Trend.singleDown,
]

export const hardTrendControlUnacceptableTrends: Trend[] = [
  ...mediumTrendControlUnacceptableTrends,
  Trend.fortyFiveUp,
  Trend.fortyFiveDown,
]

export const trendControlGame = (
  records: GlucoseRecord[],
  unacceptableTrends: Trend[],
  timing: Timing,
  streakFilterValue: number,
) => {
  const filterFunction = (records: GlucoseRecord[]) => {
    return filterRecordsByTimePeriod(records, timing.startHour, timing.startMinutes, timing.endHour, timing.endMinutes)
  }
  const dailyScoringFunction = (records: GlucoseRecord[]) => {
    return scoreRecordsByTrendControl(records, unacceptableTrends)
  }
  const getCurrentDayStatus = (currentDay: ScoredDay) => {
    const today = new Date()
    const currentlyPastEndTime = today.getHours() > timing.endHour || (today.getHours() === timing.endHour && today.getMinutes() >= timing.endMinutes)
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

export const trendControlGamesWithLevels: (
  records: GlucoseRecord[],
  timing: Timing,
) => TieredDailyStreakGame = (
  records: GlucoseRecord[],
  timing: Timing,
) => {
  return {
    easy: trendControlGame(records, easyTrendControlUnacceptableTrends, timing, 3),
    medium: trendControlGame(records, mediumTrendControlUnacceptableTrends, timing, 3),
    hard: trendControlGame(records, hardTrendControlUnacceptableTrends, timing, 3),
  }
}

export const trendControlGames: (
  records: GlucoseRecord[],
) => AllTimingsAndTiersDailyStreakGame = (
  records: GlucoseRecord[],
) => {
  return {
    morning: trendControlGamesWithLevels(records, MorningTiming),
    night: trendControlGamesWithLevels(records, NightTiming),
    afternoon: trendControlGamesWithLevels(records, AfternoonTiming),
    evening: trendControlGamesWithLevels(records, EveningTiming),
    fullDay: trendControlGamesWithLevels(records, FullDayTiming),
  }
}
