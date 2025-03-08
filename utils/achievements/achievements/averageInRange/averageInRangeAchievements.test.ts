import { test, expect, describe } from 'vitest'
import {
  oneDayAverageInRangeAchievement,
  fiveDaysAverageInRangeAchievement,
  twoDayAverageInRangeStreakAchievement,
  fiveDayAverageInRangeStreakAchievement,
  oneMorningInRangeAchievement,
  fiveMorningsInRangeAchievement,
  twoMorningStreakInRangeAchievement,
} from './averageInRangeAchievements'
import { createDate, getDayBefore } from '~/utils/test/testUtils'
import { createEmptyScoredGames, createScoredDay, createDailyStreakStatsWithDay, createDailyStreakStatsWithTwoDays } from '~/utils/test/achievementTestUtils'
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'

const today = createDate(12) // noon today
const yesterday = getDayBefore(today)
const twoDaysAgo = getDayBefore(yesterday)

describe('Average in range achievements', () => {
  describe('Single day achievements', () => {
    test('oneDayAverageInRangeAchievement - no days in range', () => {
      const mockScoredGames = createEmptyScoredGames()

      const result = oneDayAverageInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(0)
      expect(result.goal).toBe(1)
    })

    test('oneDayAverageInRangeAchievement - one day in range', () => {
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const oneDayStats = createDailyStreakStatsWithDay(yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          averageInRangeForFullDay: oneDayStats,
        },
      }

      const result = oneDayAverageInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(1)
      expect(result.goal).toBe(1)
    })

    test('fiveDaysAverageInRangeAchievement - partial progress', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 100, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          averageInRangeForFullDay: twoDayStats,
        },
      }

      const result = fiveDaysAverageInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(5)
    })
  })

  describe('Streak achievements', () => {
    test('twoDayAverageInRangeStreakAchievement - completed', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 100, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          averageInRangeForFullDay: twoDayStats,
        },
      }

      const result = twoDayAverageInRangeStreakAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(2)
    })

    test('fiveDayAverageInRangeStreakAchievement - not completed', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 100, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          averageInRangeForFullDay: twoDayStats,
        },
      }

      const result = fiveDayAverageInRangeStreakAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(5)
    })
  })

  describe('Time of day achievements', () => {
    test('oneMorningInRangeAchievement - completed', () => {
      const yesterdayScoredDay = createScoredDay(yesterday, 85, true)
      const oneDayStats = createDailyStreakStatsWithDay(yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForMornings: oneDayStats,
        },
      }

      const result = oneMorningInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(1)
      expect(result.goal).toBe(1)
    })

    test('fiveMorningsInRangeAchievement - partial progress', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 85, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 85, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForMornings: twoDayStats,
        },
      }

      const result = fiveMorningsInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(5)
    })

    test('twoMorningStreakInRangeAchievement - completed', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 85, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 85, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForMornings: twoDayStats,
        },
      }

      const result = twoMorningStreakInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(2)
    })
  })
})
