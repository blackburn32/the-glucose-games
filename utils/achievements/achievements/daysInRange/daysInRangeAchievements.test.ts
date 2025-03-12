import { test, expect, describe } from 'vitest'
import {
  oneDayInRangeAchievement,
  fiveDaysInRangeAchievement,
  twoDayStreakInRangeAchievement,
  fiveDayStreakInRangeAchievement,
  oneNightInRangeAchievement,
  fiveNightsInRangeAchievement,
  twoNightStreakInRangeAchievement,
  tenDaysInRangeAchievement,
  twentyFiveDaysInRangeAchievement,
  oneHundredsDaysInRangeAchievement,
  tenDayStreakInRangeAchievement,
  thirtyDayStreakInRangeAchievement,
  tenNightsInRangeAchievement,
  twentyFiveNightsInRangeAchievement,
  oneHundredNightsInRangeAchievement,
  fiveNightStreakInRangeAchievement,
  tenNightStreakInRangeAchievement,
  thirtyNightStreakInRangeAchievement,
  daysInRangeAchievements,
  daysInRangeAchievementGroup,
} from './daysInRangeAchievements'
import { createDate, getDayBefore, createConsecutiveDays } from '~/utils/test/testUtils'
import { createEmptyScoredGames, createScoredDay, createDailyStreakStatsWithDay, createDailyStreakStatsWithTwoDays, createDailyStreakStatsWithMultipleDays, createDailyStreakStatsWithMultipleDaysStreak } from '~/utils/test/achievementTestUtils'
import type { AchievementDefinition } from '~/types/achievementDefinition'

const today = createDate(12) // noon today
const yesterday = getDayBefore(today)

// Helper function to create mock scored games with days in range
const createMockScoredGamesWithDays = (days: Date[], score: number, isForNight: boolean = false) => {
  const scoredDays = days.map(day => createScoredDay(day, score, true))
  const stats = days.length === 1
    ? createDailyStreakStatsWithDay(scoredDays[0])
    : days.length === 2
      ? createDailyStreakStatsWithTwoDays(scoredDays[0], scoredDays[1])
      : createDailyStreakStatsWithMultipleDays(scoredDays)

  return {
    ...createEmptyScoredGames(),
    dailyStreakStats: {
      ...createEmptyScoredGames().dailyStreakStats,
      [isForNight ? 'percentTimeInRangeForNights' : 'percentTimeInRangeForFullDay']: stats,
    },
  }
}

// Helper function to create mock scored games with streak
const createMockScoredGamesWithStreak = (days: Date[], score: number, isForNight: boolean = false) => {
  const scoredDays = days.map(day => createScoredDay(day, score, true))
  const stats = createDailyStreakStatsWithMultipleDaysStreak(scoredDays)

  return {
    ...createEmptyScoredGames(),
    dailyStreakStats: {
      ...createEmptyScoredGames().dailyStreakStats,
      [isForNight ? 'percentTimeInRangeForNights' : 'percentTimeInRangeForFullDay']: stats,
    },
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
  isForNight: boolean = false,
  useStreak: boolean = false,
) => {
  test(`${achievement.id} - partial progress`, () => {
    const days = createConsecutiveDays(numDays, yesterday)
    const mockScoredGames = useStreak
      ? createMockScoredGamesWithStreak(days, score, isForNight)
      : createMockScoredGamesWithDays(days, score, isForNight)

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
  isForNight: boolean = false,
  useStreak: boolean = false,
) => {
  test(`${achievement.id} - completed`, () => {
    const days = createConsecutiveDays(numDays, yesterday)
    const mockScoredGames = useStreak
      ? createMockScoredGamesWithStreak(days, score, isForNight)
      : createMockScoredGamesWithDays(days, score, isForNight)

    const result = achievement.condition(mockScoredGames, [])
    expect(result.completed).toEqual(days[numDays - 1]) // Last day
    expect(result.progress).toBe(numDays)
    expect(result.goal).toBe(numDays)
  })
}

describe('Days in range achievements', () => {
  describe('Single day achievements', () => {
    testAchievementWithNoData(oneDayInRangeAchievement, 1)
    testAchievementCompletion(oneDayInRangeAchievement, 1)

    test('oneDayInRangeAchievement - multiple days in range', () => {
      const days = createConsecutiveDays(3, yesterday)
      const mockScoredGames = createMockScoredGamesWithDays(days.reverse(), 100)

      const result = oneDayInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(days[2]) // Should be the earliest day
      expect(result.progress).toBe(1)
      expect(result.goal).toBe(1)
    })

    testAchievementWithNoData(fiveDaysInRangeAchievement, 5)
    testAchievementWithPartialProgress(fiveDaysInRangeAchievement, 2, 5)
    testAchievementCompletion(fiveDaysInRangeAchievement, 5)

    testAchievementWithPartialProgress(tenDaysInRangeAchievement, 4, 10)
    testAchievementCompletion(tenDaysInRangeAchievement, 10)

    testAchievementWithPartialProgress(twentyFiveDaysInRangeAchievement, 15, 25)
    testAchievementCompletion(twentyFiveDaysInRangeAchievement, 25)

    testAchievementWithPartialProgress(oneHundredsDaysInRangeAchievement, 50, 100)
    testAchievementCompletion(oneHundredsDaysInRangeAchievement, 100)
  })

  describe('Streak achievements', () => {
    testAchievementWithNoData(twoDayStreakInRangeAchievement, 2)
    testAchievementCompletion(twoDayStreakInRangeAchievement, 2, 100, false, true)

    testAchievementWithPartialProgress(fiveDayStreakInRangeAchievement, 2, 5, 100, false, true)
    testAchievementCompletion(fiveDayStreakInRangeAchievement, 5, 100, false, true)

    testAchievementWithPartialProgress(tenDayStreakInRangeAchievement, 6, 10, 100, false, true)
    testAchievementCompletion(tenDayStreakInRangeAchievement, 10, 100, false, true)

    testAchievementWithPartialProgress(thirtyDayStreakInRangeAchievement, 20, 30, 100, false, true)
    testAchievementCompletion(thirtyDayStreakInRangeAchievement, 30, 100, false, true)
  })

  describe('Night achievements', () => {
    testAchievementWithNoData(oneNightInRangeAchievement, 1)
    testAchievementCompletion(oneNightInRangeAchievement, 1, 85, true)

    test('oneNightInRangeAchievement - multiple nights in range', () => {
      const days = createConsecutiveDays(3, yesterday)
      const mockScoredGames = createMockScoredGamesWithDays(days.reverse(), 85, true)

      const result = oneNightInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(days[2]) // Should be the earliest day
      expect(result.progress).toBe(1)
      expect(result.goal).toBe(1)
    })

    testAchievementWithNoData(fiveNightsInRangeAchievement, 5)
    testAchievementWithPartialProgress(fiveNightsInRangeAchievement, 2, 5, 85, true)
    testAchievementCompletion(fiveNightsInRangeAchievement, 5, 85, true)

    testAchievementCompletion(twoNightStreakInRangeAchievement, 2, 85, true, true)

    testAchievementWithPartialProgress(tenNightsInRangeAchievement, 7, 10, 85, true)
    testAchievementCompletion(tenNightsInRangeAchievement, 10, 85, true)

    testAchievementWithPartialProgress(twentyFiveNightsInRangeAchievement, 12, 25, 85, true)
    testAchievementCompletion(twentyFiveNightsInRangeAchievement, 25, 85, true)

    testAchievementWithPartialProgress(oneHundredNightsInRangeAchievement, 40, 100, 85, true)
    testAchievementCompletion(oneHundredNightsInRangeAchievement, 100, 85, true)

    testAchievementWithPartialProgress(fiveNightStreakInRangeAchievement, 3, 5, 85, true, true)
    testAchievementCompletion(fiveNightStreakInRangeAchievement, 5, 85, true, true)

    testAchievementWithPartialProgress(tenNightStreakInRangeAchievement, 7, 10, 85, true, true)
    testAchievementCompletion(tenNightStreakInRangeAchievement, 10, 85, true, true)

    testAchievementWithPartialProgress(thirtyNightStreakInRangeAchievement, 15, 30, 85, true, true)
    testAchievementCompletion(thirtyNightStreakInRangeAchievement, 30, 85, true, true)
  })

  test('achievement groups are properly exported', () => {
    expect(daysInRangeAchievements).toEqual([
      oneDayInRangeAchievement,
      fiveDaysInRangeAchievement,
      tenDaysInRangeAchievement,
      twentyFiveDaysInRangeAchievement,
      oneHundredsDaysInRangeAchievement,
      twoDayStreakInRangeAchievement,
      fiveDayStreakInRangeAchievement,
      tenDayStreakInRangeAchievement,
      thirtyDayStreakInRangeAchievement,
    ])

    expect(daysInRangeAchievementGroup).toEqual({
      name: 'Days in range',
      achievements: daysInRangeAchievements,
    })
  })
})
