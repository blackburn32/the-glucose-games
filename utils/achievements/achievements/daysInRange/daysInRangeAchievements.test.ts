import { test, expect, describe } from 'vitest'
import {
  oneDayInRangeAchievement,
  fiveDaysInRangeAchievement,
  twoDayStreakInRangeAchievement,
  fiveDayStreakInRangeAchievement,
  oneNightInRangeAchievement,
  fiveNightsInRangeAchievement,
  twoNightStreakInRangeAchievement,
} from './daysInRangeAchievements'
import { createDate, getDayBefore } from '~/utils/test/testUtils'
import { createEmptyScoredGames, createScoredDay, createDailyStreakStatsWithDay, createDailyStreakStatsWithTwoDays } from '~/utils/test/achievementTestUtils'
import type { ScoredGlucoseGames } from '~/types/scoredGlucoseGames'

const today = createDate(12) // noon today
const yesterday = getDayBefore(today)
const twoDaysAgo = getDayBefore(yesterday)

describe('Days in range achievements', () => {
  describe('Single day achievements', () => {
    test('oneDayInRangeAchievement - no days in range', () => {
      const mockScoredGames = createEmptyScoredGames()

      const result = oneDayInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(0)
      expect(result.goal).toBe(1)
    })

    test('oneDayInRangeAchievement - one day in range', () => {
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const oneDayStats = createDailyStreakStatsWithDay(yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForFullDay: oneDayStats,
        },
      }

      const result = oneDayInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(1)
      expect(result.goal).toBe(1)
    })

    test('fiveDaysInRangeAchievement - partial progress', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 100, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForFullDay: twoDayStats,
        },
      }

      const result = fiveDaysInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(5)
    })
  })

  describe('Streak achievements', () => {
    test('twoDayStreakInRangeAchievement - completed', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 100, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForFullDay: twoDayStats,
        },
      }

      const result = twoDayStreakInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(2)
    })

    test('fiveDayStreakInRangeAchievement - not completed', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 100, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 100, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForFullDay: twoDayStats,
        },
      }

      const result = fiveDayStreakInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(5)
    })
  })

  describe('Night achievements', () => {
    test('oneNightInRangeAchievement - completed', () => {
      const yesterdayScoredDay = createScoredDay(yesterday, 85, true)
      const oneDayStats = createDailyStreakStatsWithDay(yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForNights: oneDayStats,
        },
      }

      const result = oneNightInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(1)
      expect(result.goal).toBe(1)
    })

    test('fiveNightsInRangeAchievement - partial progress', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 85, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 85, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForNights: twoDayStats,
        },
      }

      const result = fiveNightsInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toBeUndefined()
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(5)
    })

    test('twoNightStreakInRangeAchievement - completed', () => {
      const twoDaysAgoScoredDay = createScoredDay(twoDaysAgo, 85, true)
      const yesterdayScoredDay = createScoredDay(yesterday, 85, true)
      const twoDayStats = createDailyStreakStatsWithTwoDays(twoDaysAgoScoredDay, yesterdayScoredDay)

      const mockScoredGames: ScoredGlucoseGames = {
        ...createEmptyScoredGames(),
        dailyStreakStats: {
          ...createEmptyScoredGames().dailyStreakStats,
          percentTimeInRangeForNights: twoDayStats,
        },
      }

      const result = twoNightStreakInRangeAchievement.condition(mockScoredGames, [])
      expect(result.completed).toEqual(yesterday)
      expect(result.progress).toBe(2)
      expect(result.goal).toBe(2)
    })
  })
})
