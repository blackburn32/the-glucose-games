import { describe, it, expect } from 'vitest'
import { calculateContiguousStreakStats } from './contiguousStreaks'
import type { GlucoseRecord } from '~/types/glucoseRecord'

describe('calculateContiguousStreakStats', () => {
  const createRecord = (value: number, created: Date): GlucoseRecord => ({
    value,
    created,
    x: 0,
    y: 0,
    provider: 'test',
  })

  it('should calculate streak stats correctly', () => {
    const records: GlucoseRecord[] = [
      createRecord(100, new Date('2024-01-01T10:00:00')),
      createRecord(110, new Date('2024-01-01T11:00:00')),
      createRecord(90, new Date('2024-01-01T12:00:00')), // Break streak
      createRecord(100, new Date('2024-01-01T13:00:00')),
      createRecord(105, new Date('2024-01-01T14:00:00')),
      createRecord(108, new Date('2024-01-01T15:00:00')),
    ]

    const result = calculateContiguousStreakStats(records, record => record.value >= 100)

    expect(result.streaks).toHaveLength(2)
    expect(result.longestStreak).toHaveLength(3)
    expect(result.currentStreak).toHaveLength(3)
    expect(result.currentlyInStreak).toBe(true)
  })

  it('should handle empty records', () => {
    const records: GlucoseRecord[] = []
    const result = calculateContiguousStreakStats(records, record => record.value >= 100)

    expect(result.streaks).toHaveLength(0)
    expect(result.longestStreak).toHaveLength(0)
    expect(result.currentStreak).toHaveLength(0)
    expect(result.currentlyInStreak).toBe(false)
  })

  it('should handle no streaks', () => {
    const records: GlucoseRecord[] = [
      createRecord(90, new Date('2024-01-01T10:00:00')),
      createRecord(95, new Date('2024-01-01T11:00:00')),
    ]

    const result = calculateContiguousStreakStats(records, record => record.value >= 100)

    expect(result.streaks).toHaveLength(0)
    expect(result.longestStreak).toHaveLength(0)
    expect(result.currentStreak).toHaveLength(0)
    expect(result.currentlyInStreak).toBe(false)
    expect(result.streakStringToDisplay).toBe('Not in range')
  })

  it('should handle single record streak', () => {
    const records: GlucoseRecord[] = [
      createRecord(100, new Date('2024-01-01T10:00:00')),
    ]

    const result = calculateContiguousStreakStats(records, record => record.value >= 100)

    expect(result.streaks).toHaveLength(1)
    expect(result.longestStreak).toHaveLength(1)
    expect(result.currentStreak).toHaveLength(1)
    expect(result.currentlyInStreak).toBe(true)
  })
}) 