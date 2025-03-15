import type { DailyStreakStats } from '~/types/dailyStreakStats'
import type { GameDisplayStats } from '~/types/gameDisplayStats'
import type { ScoredDay } from '~/types/scoredDay'

export const getPercentToDisplay = (percent: string | undefined): string => {
  return percent ? `${percent}%` : 'Unknown'
}

export const getGlucoseValueToDisplay = (glucoseValue: string | undefined): string => {
  return glucoseValue ? `${glucoseValue} mg/dL` : 'Unknown'
}

export const getDailyStreakGameDisplayStats = (title: string, streak: DailyStreakStats, scoreHandler: (score: string | undefined) => string): GameDisplayStats => {
  return {
    title,
    data: streak.currentScoredDayWithFallback?.glucoseRecords ?? [],
    description: scoreHandler(streak.currentScoredDayWithFallback?.scoreForDisplay),
    best: scoreHandler(streak.bestDay?.scoreForDisplay),
  }
}

export const scoredDayIsPending = (scoredDay: ScoredDay): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dayDate = new Date(scoredDay.date)
  dayDate.setHours(0, 0, 0, 0)

  return dayDate >= today
}

export const getIconAndColorForScoredDay = (day: ScoredDay) => {
  if (!day) {
    return {
      name: 'ph:question-fill',
      color: 'text-base-content',
    }
  }
  if (scoredDayIsPending(day)) {
    return {
      name: 'ph:clock-fill',
      color: 'text-secondary',
    }
  }
  if (day.passesThreshold) {
    return {
      name: 'ph:check-circle-fill',
      color: 'text-primary',
    }
  }
  return {
    name: 'ph:x-circle-fill',
    color: 'text-error',
  }
}
