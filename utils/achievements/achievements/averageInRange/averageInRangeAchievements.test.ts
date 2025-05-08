import { test, expect, describe } from 'vitest'
import {
  oneDayAverageInRangeAchievement,
  fiveDaysAverageInRangeAchievement,
  tenDaysAverageInRangeAchievement,
  twentyFiveDaysAverageInRangeAchievement,
  oneHundredDaysAverageInRangeAchievement,
  twoDayAverageInRangeStreakAchievement,
  fiveDayAverageInRangeStreakAchievement,
  tenDayAverageInRangeStreakAchievement,
  thirtyDayAverageInRangeStreakAchievement,
  oneMorningInRangeAchievement,
  fiveMorningsInRangeAchievement,
  tenMorningsInRangeAchievement,
  twentyFiveMorningsInRangeAchievement,
  oneHundredMorningsInRangeAchievement,
  twoMorningStreakInRangeAchievement,
  fiveMorningStreakInRangeAchievement,
  tenMorningStreakInRangeAchievement,
  thirtyMorningStreakInRangeAchievement,
  oneAfternoonInRangeAchievement,
  fiveAfternoonsInRangeAchievement,
  tenAfternoonsInRangeAchievement,
  twentyFiveAfternoonsInRangeAchievement,
  oneHundredAfternoonsInRangeAchievement,
  twoAfternoonStreakInRangeAchievement,
  fiveAfternoonStreakInRangeAchievement,
  tenAfternoonStreakInRangeAchievement,
  thirtyAfternoonStreakInRangeAchievement,
  oneEveningInRangeAchievement,
  fiveEveningsInRangeAchievement,
  tenEveningsInRangeAchievement,
  twentyFiveEveningsInRangeAchievement,
  oneHundredEveningsInRangeAchievement,
  twoEveningStreakInRangeAchievement,
  fiveEveningStreakInRangeAchievement,
  tenEveningStreakInRangeAchievement,
  thirtyEveningStreakInRangeAchievement,
} from './averageInRangeAchievements'
import { createDate, getDayBefore } from '~/utils/test/testUtils'
import { createEmptyScoredGames, createScoredDay, createDailyStreakStatsWithDay, createDailyStreakStatsWithTwoDays, createDailyStreakStatsWithMultipleDays, createDailyStreakStatsWithMultipleDaysStreak } from '~/utils/test/achievementTestUtils'
import type { AchievementDefinition } from '~/types/achievementDefinition'
import { AfternoonTiming, EveningTiming, FullDayTiming, MorningTiming } from '~/types/timing'

const today = createDate(12) // noon today
const yesterday = getDayBefore(today)

// Helper function to create mock scored games with days in range
const createMockScoredGamesWithDays = (days: Date[], score: number, statKey: number = FullDayTiming.id, isStreak: boolean = false) => {
  const scoredDays = days.map(day => createScoredDay(day, score, true))
  const stats = days.length === 1
    ? createDailyStreakStatsWithDay(scoredDays[0])
    : days.length === 2
      ? createDailyStreakStatsWithTwoDays(scoredDays[0], scoredDays[1])
      : isStreak
        ? createDailyStreakStatsWithMultipleDaysStreak(scoredDays)
        : createDailyStreakStatsWithMultipleDays(scoredDays)

  const dailyStreakStats = {
    ...createEmptyScoredGames().dailyStreakStats,
  }
  if (statKey === MorningTiming.id || statKey === AfternoonTiming.id || statKey === EveningTiming.id) {
    dailyStreakStats.percentTimeInRangeForSemanticPeriods[statKey] = stats
  }
  else {
    dailyStreakStats.averageInRangeForSemanticPeriods[statKey] = stats
  }

  return {
    ...createEmptyScoredGames(),
    dailyStreakStats,
  }
}

// Helper function to test achievement with no data
const testAchievementWithNoData = (achievement: AchievementDefinition, goal: number) => {
  test(`${achievement.id} - no data`, () => {
    const mockScoredGames = createEmptyScoredGames()
    const result = achievement.condition(mockScoredGames, [])
    expect(result.completed).toBeUndefined()
    expect(result.progress).toBe(0)
    expect(result.goal).toBe(goal)
  })
}

// Helper function to test achievement with partial progress
const testAchievementWithPartialProgress = (
  achievement: AchievementDefinition,
  numDays: number,
  goal: number,
  score: number = 100,
  statKey: number = FullDayTiming.id,
  isStreak: boolean = false,
) => {
  test(`${achievement.id} - partial progress`, () => {
    const days = Array.from({ length: numDays }, (_, i) => {
      const date = new Date(yesterday)
      date.setDate(date.getDate() - i)
      return date
    }).reverse()
    const mockScoredGames = createMockScoredGamesWithDays(days, score, statKey, isStreak)

    const result = achievement.condition(mockScoredGames, [])
    expect(result.completed).toBeUndefined()
    expect(result.progress).toBe(numDays)
    expect(result.goal).toBe(goal)
  })
}

// Helper function to test achievement completion
const testAchievementCompletion = (
  achievement: AchievementDefinition,
  numDays: number,
  score: number = 100,
  statKey: number = FullDayTiming.id,
  isStreak: boolean = false,
) => {
  test(`${achievement.id} - completed`, () => {
    const days = Array.from({ length: numDays }, (_, i) => {
      const date = new Date(yesterday)
      date.setDate(date.getDate() - i)
      return date
    }).reverse()
    const mockScoredGames = createMockScoredGamesWithDays(days, score, statKey, isStreak)

    const result = achievement.condition(mockScoredGames, [])
    expect(result.completed).toEqual(yesterday)
    expect(result.progress).toBe(numDays)
    expect(result.goal).toBe(numDays)
  })
}

describe('Average in range achievements', () => {
  describe('Single day achievements', () => {
    testAchievementWithNoData(oneDayAverageInRangeAchievement, 1)
    testAchievementCompletion(oneDayAverageInRangeAchievement, 1)
    testAchievementWithPartialProgress(fiveDaysAverageInRangeAchievement, 2, 5)
    testAchievementCompletion(fiveDaysAverageInRangeAchievement, 5)
    testAchievementWithPartialProgress(tenDaysAverageInRangeAchievement, 4, 10)
    testAchievementCompletion(tenDaysAverageInRangeAchievement, 10)
    testAchievementWithPartialProgress(twentyFiveDaysAverageInRangeAchievement, 15, 25)
    testAchievementCompletion(twentyFiveDaysAverageInRangeAchievement, 25)
    testAchievementWithPartialProgress(oneHundredDaysAverageInRangeAchievement, 50, 100)
    testAchievementCompletion(oneHundredDaysAverageInRangeAchievement, 100)
  })

  describe('Streak achievements', () => {
    testAchievementCompletion(twoDayAverageInRangeStreakAchievement, 2, 100, FullDayTiming.id, true)
    testAchievementWithPartialProgress(fiveDayAverageInRangeStreakAchievement, 2, 5, 100, FullDayTiming.id, true)
    testAchievementCompletion(fiveDayAverageInRangeStreakAchievement, 5, 100, FullDayTiming.id, true)
    testAchievementWithPartialProgress(tenDayAverageInRangeStreakAchievement, 6, 10, 100, FullDayTiming.id, true)
    testAchievementCompletion(tenDayAverageInRangeStreakAchievement, 10, 100, FullDayTiming.id, true)
    testAchievementWithPartialProgress(thirtyDayAverageInRangeStreakAchievement, 20, 30, 100, FullDayTiming.id, true)
    testAchievementCompletion(thirtyDayAverageInRangeStreakAchievement, 30, 100, FullDayTiming.id, true)
  })

  describe('Time of day achievements', () => {
    describe('Morning achievements', () => {
      testAchievementCompletion(oneMorningInRangeAchievement, 1, 85, MorningTiming.id)
      testAchievementWithPartialProgress(fiveMorningsInRangeAchievement, 2, 5, 85, MorningTiming.id)
      testAchievementCompletion(fiveMorningsInRangeAchievement, 5, 85, MorningTiming.id)
      testAchievementWithPartialProgress(tenMorningsInRangeAchievement, 7, 10, 85, MorningTiming.id)
      testAchievementCompletion(tenMorningsInRangeAchievement, 10, 85, MorningTiming.id)
      testAchievementWithPartialProgress(twentyFiveMorningsInRangeAchievement, 12, 25, 85, MorningTiming.id)
      testAchievementCompletion(twentyFiveMorningsInRangeAchievement, 25, 85, MorningTiming.id)
      testAchievementWithPartialProgress(oneHundredMorningsInRangeAchievement, 40, 100, 85, MorningTiming.id)
      testAchievementCompletion(oneHundredMorningsInRangeAchievement, 100, 85, MorningTiming.id)

      // Morning streak achievements
      testAchievementCompletion(twoMorningStreakInRangeAchievement, 2, 85, MorningTiming.id, true)
      testAchievementWithPartialProgress(fiveMorningStreakInRangeAchievement, 3, 5, 85, MorningTiming.id, true)
      testAchievementCompletion(fiveMorningStreakInRangeAchievement, 5, 85, MorningTiming.id, true)
      testAchievementWithPartialProgress(tenMorningStreakInRangeAchievement, 7, 10, 85, MorningTiming.id, true)
      testAchievementCompletion(tenMorningStreakInRangeAchievement, 10, 85, MorningTiming.id, true)
      testAchievementWithPartialProgress(thirtyMorningStreakInRangeAchievement, 15, 30, 85, MorningTiming.id, true)
      testAchievementCompletion(thirtyMorningStreakInRangeAchievement, 30, 85, MorningTiming.id, true)
    })

    describe('Afternoon achievements', () => {
      testAchievementCompletion(oneAfternoonInRangeAchievement, 1, 85, AfternoonTiming.id)
      testAchievementWithPartialProgress(fiveAfternoonsInRangeAchievement, 2, 5, 85, AfternoonTiming.id)
      testAchievementCompletion(fiveAfternoonsInRangeAchievement, 5, 85, AfternoonTiming.id)
      testAchievementWithPartialProgress(tenAfternoonsInRangeAchievement, 7, 10, 85, AfternoonTiming.id)
      testAchievementCompletion(tenAfternoonsInRangeAchievement, 10, 85, AfternoonTiming.id)
      testAchievementWithPartialProgress(twentyFiveAfternoonsInRangeAchievement, 12, 25, 85, AfternoonTiming.id)
      testAchievementCompletion(twentyFiveAfternoonsInRangeAchievement, 25, 85, AfternoonTiming.id)
      testAchievementWithPartialProgress(oneHundredAfternoonsInRangeAchievement, 40, 100, 85, AfternoonTiming.id)
      testAchievementCompletion(oneHundredAfternoonsInRangeAchievement, 100, 85, AfternoonTiming.id)

      // Afternoon streak achievements
      testAchievementCompletion(twoAfternoonStreakInRangeAchievement, 2, 85, AfternoonTiming.id, true)
      testAchievementWithPartialProgress(fiveAfternoonStreakInRangeAchievement, 3, 5, 85, AfternoonTiming.id, true)
      testAchievementCompletion(fiveAfternoonStreakInRangeAchievement, 5, 85, AfternoonTiming.id, true)
      testAchievementWithPartialProgress(tenAfternoonStreakInRangeAchievement, 7, 10, 85, AfternoonTiming.id, true)
      testAchievementCompletion(tenAfternoonStreakInRangeAchievement, 10, 85, AfternoonTiming.id, true)
      testAchievementWithPartialProgress(thirtyAfternoonStreakInRangeAchievement, 15, 30, 85, AfternoonTiming.id, true)
      testAchievementCompletion(thirtyAfternoonStreakInRangeAchievement, 30, 85, AfternoonTiming.id, true)
    })

    describe('Evening achievements', () => {
      testAchievementCompletion(oneEveningInRangeAchievement, 1, 85, EveningTiming.id)
      testAchievementWithPartialProgress(fiveEveningsInRangeAchievement, 2, 5, 85, EveningTiming.id)
      testAchievementCompletion(fiveEveningsInRangeAchievement, 5, 85, EveningTiming.id)
      testAchievementWithPartialProgress(tenEveningsInRangeAchievement, 7, 10, 85, EveningTiming.id)
      testAchievementCompletion(tenEveningsInRangeAchievement, 10, 85, EveningTiming.id)
      testAchievementWithPartialProgress(twentyFiveEveningsInRangeAchievement, 12, 25, 85, EveningTiming.id)
      testAchievementCompletion(twentyFiveEveningsInRangeAchievement, 25, 85, EveningTiming.id)
      testAchievementWithPartialProgress(oneHundredEveningsInRangeAchievement, 40, 100, 85, EveningTiming.id)
      testAchievementCompletion(oneHundredEveningsInRangeAchievement, 100, 85, EveningTiming.id)

      // Evening streak achievements
      testAchievementCompletion(twoEveningStreakInRangeAchievement, 2, 85, EveningTiming.id, true)
      testAchievementWithPartialProgress(fiveEveningStreakInRangeAchievement, 3, 5, 85, EveningTiming.id, true)
      testAchievementCompletion(fiveEveningStreakInRangeAchievement, 5, 85, EveningTiming.id, true)
      testAchievementWithPartialProgress(tenEveningStreakInRangeAchievement, 7, 10, 85, EveningTiming.id, true)
      testAchievementCompletion(tenEveningStreakInRangeAchievement, 10, 85, EveningTiming.id, true)
      testAchievementWithPartialProgress(thirtyEveningStreakInRangeAchievement, 15, 30, 85, EveningTiming.id, true)
      testAchievementCompletion(thirtyEveningStreakInRangeAchievement, 30, 85, EveningTiming.id, true)
    })
  })
})
