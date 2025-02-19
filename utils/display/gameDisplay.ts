import type { DailyStreakStats } from '~/types/dailyStreakStats'
import type { GameDisplayStats } from '~/types/gameDisplayStats'

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
