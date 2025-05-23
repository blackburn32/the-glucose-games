import { getLocalTimeZone, type DateValue } from '@internationalized/date'
import { differenceInDays } from 'date-fns'
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import type { GameDisplayStats } from '~/types/gameDisplayStats'
import type { ScoredDay } from '~/types/scoredDay'
import { CurrentDayStatus, MedalType } from '~/types/constants'
import { ScoreCheckResult } from '~/types/scoreCheckResult'
import type { Timing } from '~/types/timing'
import type { TimeBasedDailyStreaks } from '~/types/timeBasedDailyStreaks'

export const getPercentToDisplay = (percent: string | undefined): string => {
  return percent ? `${percent}%` : 'Unknown'
}

export const getGlucoseValueToDisplay = (glucoseValue: string | undefined, unit: string | undefined = undefined): string => {
  return glucoseValue ? `${glucoseValue} ${unit ?? 'mg/dL'}` : 'Unknown'
}

export const getDailyStreakGameDisplayStats = (title: string, streak: DailyStreakStats, scoreHandler: (score: string | undefined) => string, date: DateValue): GameDisplayStats => {
  const dayToUse = streak.scoredDays.find((day) => {
    const difference = differenceInDays(day.date, date.toDate(getLocalTimeZone()))
    return difference === 0
  }) ?? streak.currentScoredDayWithFallback
  return {
    title,
    data: dayToUse?.glucoseRecords ?? [],
    description: scoreHandler(dayToUse?.scoreForDisplay),
    best: scoreHandler(streak.bestDay?.scoreForDisplay),
  }
}

export const getDailyStreakGameDisplayStatsForSemanticPeriod = (semanticPeriod: Timing, streaks: TimeBasedDailyStreaks, scoreHandler: (score: string | undefined) => string, date: DateValue): GameDisplayStats => {
  const streak = streaks[semanticPeriod.id]
  return getDailyStreakGameDisplayStats(semanticPeriod.badgeTitle, streak, scoreHandler, date)
}

export const scoredDayIsPending = (scoredDay: ScoredDay): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dayDate = new Date(scoredDay.date)
  dayDate.setHours(0, 0, 0, 0)

  return dayDate >= today
}

export const getColorForMedal = (medal: MedalType | undefined): string => {
  switch (medal) {
    case MedalType.Gold:
      return 'text-primary'
    case MedalType.Silver:
      return 'text-silver'
    case MedalType.Bronze:
      return 'text-secondary'
    default:
      return 'text-error'
  }
}

export const getIconForScoreResult = (scoreResult: ScoreCheckResult): string => {
  switch (scoreResult) {
    case ScoreCheckResult.Pass:
      return 'ph:check-circle-fill'
    case ScoreCheckResult.Almost:
      return 'ph:warning-circle-fill'
    default:
      return 'ph:x-circle-fill'
  }
}

export const getColorForScoreResult = (scoreResult: ScoreCheckResult): string => {
  switch (scoreResult) {
    case ScoreCheckResult.Pass:
      return 'text-accent'
    case ScoreCheckResult.Almost:
      return 'text-primary'
    default:
      return 'text-error'
  }
}

export const getIconAndColorForScoredDay = (day: ScoredDay) => {
  if (scoredDayIsPending(day)) {
    return {
      name: 'ph:clock-fill',
      color: 'text-base-content',
    }
  }
  if (day.medal) {
    return {
      name: 'ph:medal-fill',
      color: getColorForMedal(day.medal),
    }
  }
  return {
    name: getIconForScoreResult(day.scoreResult),
    color: getColorForScoreResult(day.scoreResult),
  }
}

export const getIconAndColorForCurrentDay = (currentDayStatus: CurrentDayStatus, day: ScoredDay) => {
  switch (currentDayStatus) {
    case CurrentDayStatus.Pass:
      return {
        name: 'ph:check-circle-fill',
        color: 'text-accent',
      }
    case CurrentDayStatus.Fail:
      return {
        name: 'ph:x-circle-fill',
        color: 'text-error',
      }
    case CurrentDayStatus.Pending:
      return {
        name: 'ph:clock-fill',
        color: 'text-base-content',
      }
    default:
      return getIconAndColorForScoredDay(day)
  }
}
