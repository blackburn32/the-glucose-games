import { describe, it, expect } from 'vitest'
import { calculateDailyStreakStats } from './dailyStreaks'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { CurrentDayStatus } from '~/types/constants'
import type { ScoredDay } from '~/types/scoredDay'
import { ScoreCheckResult } from '~/types/scoreCheckResult'

describe('calculateDailyStreakStats', () => {
  const createRecord = (value: number, created: Date): GlucoseRecord => ({
    value,
    created,
    x: 0,
    y: 0,
    provider: 'test',
  })

  const mockFilterFunction = (records: GlucoseRecord[]) => records
  const mockScoringFunction = (records: GlucoseRecord[]) => {
    const sum = records.reduce((acc, record) => acc + record.value, 0)
    return records.length ? sum / records.length : 0
  }
  const mockScorePassesCheck = (score: number) => {
    if (score >= 100) return ScoreCheckResult.Pass
    else if (score >= 90) return ScoreCheckResult.Almost
    else return ScoreCheckResult.Fail
  }
  const mockScoreDisplay = (score: number) => score.toFixed(1)
  const mockCurrentDayStatus = (day: ScoredDay) => {
    if (day.passesThreshold) return CurrentDayStatus.Pass
    return CurrentDayStatus.Fail
  }

  it('should calculate daily streak stats correctly', () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const records: GlucoseRecord[] = [
      createRecord(100, yesterday),
      createRecord(120, yesterday),
      createRecord(110, today),
      createRecord(130, today),
    ]

    const result = calculateDailyStreakStats(
      records,
      mockFilterFunction,
      mockScoringFunction,
      mockScorePassesCheck,
      mockCurrentDayStatus,
      mockScoreDisplay,
    )

    expect(result.scoredDays).toHaveLength(2)
    expect(result.currentStreak.scoredDays).toHaveLength(2)
    expect(result.bestStreak).toHaveLength(2)
  })

  it('should handle empty records', () => {
    const records: GlucoseRecord[] = []

    const result = calculateDailyStreakStats(
      records,
      mockFilterFunction,
      mockScoringFunction,
      mockScorePassesCheck,
      mockCurrentDayStatus,
      mockScoreDisplay,
    )

    expect(result.scoredDays).toHaveLength(0)
    expect(result.currentStreak.scoredDays).toHaveLength(0)
    expect(result.bestStreak).toHaveLength(0)
  })

  it('should handle broken streaks', () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const records: GlucoseRecord[] = [
      createRecord(120, twoDaysAgo), // Pass
      createRecord(80, yesterday), // Fail
      createRecord(110, today), // Pass
    ]

    const result = calculateDailyStreakStats(
      records,
      mockFilterFunction,
      mockScoringFunction,
      mockScorePassesCheck,
      mockCurrentDayStatus,
      mockScoreDisplay,
    )

    expect(result.scoredDays).toHaveLength(3)
    expect(result.currentStreak.scoredDays).toHaveLength(1) // Only today
    expect(result.bestStreak).toHaveLength(1) // Either today or two days ago
  })

  it('should use custom comparison function for best day', () => {
    const today = new Date()
    const records: GlucoseRecord[] = [
      createRecord(95, today), // Day 1 average: 95
      createRecord(110, new Date(today.getTime() + 24 * 60 * 60 * 1000)), // Day 2 average: 110
    ]

    const bestDayComparisonFunction = (a: ScoredDay, b: ScoredDay) => {
      const aDiff = Math.abs(a.score - 100)
      const bDiff = Math.abs(b.score - 100)
      return aDiff < bDiff ? a : b
    }

    const result = calculateDailyStreakStats(
      records,
      mockFilterFunction,
      mockScoringFunction,
      mockScorePassesCheck,
      mockCurrentDayStatus,
      mockScoreDisplay,
      bestDayComparisonFunction,
    )

    expect(result.bestDay?.score).toBe(95) // Should pick the value closer to 100
  })
})
