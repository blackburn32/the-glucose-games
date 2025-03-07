import { test, expect } from 'vitest'
import { contiguousStreakWithNoLows, contiguousStreakWithNoHighs, contiguousStreakWithNoLowsOrHighs } from './contiguousStreakGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'

const mockThresholds: Thresholds = {
  low: 70,
  high: 180
}

const createMockRecord = (value: number, minutesAgo: number = 0): GlucoseRecord => ({
  value,
  created: new Date(Date.now() - minutesAgo * 60 * 1000),
  x: Date.now() - minutesAgo * 60 * 1000,
  y: value,
  provider: 'test'
})

test('contiguousStreakWithNoLows identifies streak without low values', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(100, 50),
    createMockRecord(80, 40),
    createMockRecord(75, 30),
    createMockRecord(65, 20), // Low value breaks streak
    createMockRecord(90, 10),
    createMockRecord(85, 0)
  ]

  const result = contiguousStreakWithNoLows(records, mockThresholds)

  // Current streak should be the last two values
  expect(result.currentStreak).toHaveLength(2)
  expect(result.currentStreak[0].value).toBe(90)
  expect(result.currentStreak[1].value).toBe(85)

  // Longest streak should be the first three values
  expect(result.longestStreak).toHaveLength(3)
  expect(result.longestStreak[0].value).toBe(100)
  expect(result.longestStreak[1].value).toBe(80)
  expect(result.longestStreak[2].value).toBe(75)

  expect(result.currentlyInStreak).toBe(true)
})

test('contiguousStreakWithNoHighs identifies streak without high values', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(150, 50),
    createMockRecord(160, 40),
    createMockRecord(190, 30), // High value breaks streak
    createMockRecord(170, 20),
    createMockRecord(175, 10),
    createMockRecord(185, 0) // High value ends current streak
  ]

  const result = contiguousStreakWithNoHighs(records, mockThresholds)

  // Current streak should be empty (ended with high value)
  expect(result.currentStreak).toHaveLength(0)

  // Longest streak should be the first two values
  expect(result.longestStreak).toHaveLength(2)
  expect(result.longestStreak[0].value).toBe(150)
  expect(result.longestStreak[1].value).toBe(160)

  expect(result.currentlyInStreak).toBe(false)
})

test('contiguousStreakWithNoLowsOrHighs identifies streak within range', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(65, 60),  // Low value
    createMockRecord(100, 50),
    createMockRecord(150, 40),
    createMockRecord(190, 30), // High value
    createMockRecord(120, 20),
    createMockRecord(130, 10),
    createMockRecord(140, 0)
  ]

  const result = contiguousStreakWithNoLowsOrHighs(records, mockThresholds)

  // Current streak should be the last three values
  expect(result.currentStreak).toHaveLength(3)
  expect(result.currentStreak[0].value).toBe(120)
  expect(result.currentStreak[1].value).toBe(130)
  expect(result.currentStreak[2].value).toBe(140)

  // Longest streak should be the two values in the middle
  expect(result.longestStreak).toHaveLength(3)
  expect(result.longestStreak[0].value).toBe(120)
  expect(result.longestStreak[1].value).toBe(130)
  expect(result.longestStreak[2].value).toBe(140)

  expect(result.currentlyInStreak).toBe(true)
})

test('all streak functions handle empty record list', () => {
  const emptyRecords: GlucoseRecord[] = []

  const noLowsResult = contiguousStreakWithNoLows(emptyRecords, mockThresholds)
  const noHighsResult = contiguousStreakWithNoHighs(emptyRecords, mockThresholds)
  const noLowsOrHighsResult = contiguousStreakWithNoLowsOrHighs(emptyRecords, mockThresholds)

  // All should return empty streaks
  expect(noLowsResult.currentStreak).toHaveLength(0)
  expect(noLowsResult.longestStreak).toHaveLength(0)
  expect(noHighsResult.currentStreak).toHaveLength(0)
  expect(noHighsResult.longestStreak).toHaveLength(0)
  expect(noLowsOrHighsResult.currentStreak).toHaveLength(0)
  expect(noLowsOrHighsResult.longestStreak).toHaveLength(0)

  // None should be in streak
  expect(noLowsResult.currentlyInStreak).toBe(false)
  expect(noHighsResult.currentlyInStreak).toBe(false)
  expect(noLowsOrHighsResult.currentlyInStreak).toBe(false)
})

test('streak functions handle single record', () => {
  const singleRecord = [createMockRecord(100, 0)]

  const noLowsResult = contiguousStreakWithNoLows(singleRecord, mockThresholds)
  const noHighsResult = contiguousStreakWithNoHighs(singleRecord, mockThresholds)
  const noLowsOrHighsResult = contiguousStreakWithNoLowsOrHighs(singleRecord, mockThresholds)

  // All should have single record streaks
  expect(noLowsResult.currentStreak).toHaveLength(1)
  expect(noLowsResult.longestStreak).toHaveLength(1)
  expect(noHighsResult.currentStreak).toHaveLength(1)
  expect(noHighsResult.longestStreak).toHaveLength(1)
  expect(noLowsOrHighsResult.currentStreak).toHaveLength(1)
  expect(noLowsOrHighsResult.longestStreak).toHaveLength(1)

  // All should be in streak
  expect(noLowsResult.currentlyInStreak).toBe(true)
  expect(noHighsResult.currentlyInStreak).toBe(true)
  expect(noLowsOrHighsResult.currentlyInStreak).toBe(true)
})

test('streak functions handle boundary values', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(mockThresholds.low, 20),     // Exactly low threshold
    createMockRecord(mockThresholds.high, 10),    // Exactly high threshold
    createMockRecord((mockThresholds.low + mockThresholds.high) / 2, 0)  // Middle value
  ]

  const noLowsResult = contiguousStreakWithNoLows(records, mockThresholds)
  const noHighsResult = contiguousStreakWithNoHighs(records, mockThresholds)
  const noLowsOrHighsResult = contiguousStreakWithNoLowsOrHighs(records, mockThresholds)

  // All values should be included in streaks (boundary values are acceptable)
  expect(noLowsResult.currentStreak).toHaveLength(3)
  expect(noHighsResult.currentStreak).toHaveLength(3)
  expect(noLowsOrHighsResult.currentStreak).toHaveLength(3)

  expect(noLowsResult.currentlyInStreak).toBe(true)
  expect(noHighsResult.currentlyInStreak).toBe(true)
  expect(noLowsOrHighsResult.currentlyInStreak).toBe(true)
}) 