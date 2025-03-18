import { test, expect, vi, beforeAll } from 'vitest'
import {
  percentTimeInRangeForFullDayStreak,
  percentTimeInRangeForNightsStreak,
  percentTimeInRangeForMorningsStreak,
  percentTimeInRangeForAfternoonsStreak,
  percentTimeInRangeForEveningsStreak,
} from './percentTimeInRangeGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { createDate, getDayBefore, getMockGlucoseRecord } from '~/utils/test/testUtils'
import { CurrentDayStatus } from '~/types/constants'
import { generateSingleValueGlucoseRecords } from '~/utils/generators/singleValue/singleValueGenerator'
import type { ScoredDay } from '~/types/scoredDay'
import type { DailyStreakStats } from '~/types/dailyStreakStats'

const mockThresholds: Thresholds = {
  low: 70,
  high: 180,
}

const midnight = createDate(0)
const oneAm = createDate(1)
const fiveAm = createDate(5)
const sixAm = createDate(6)
const elevenAm = createDate(11)
const twelvePm = createDate(12)
const fivePm = createDate(17)
const sixPm = createDate(18)
const elevenPm = createDate(23)
const elevenFiftyEightPm = createDate(23, 58)
const yesterday = getDayBefore(midnight)
const dayBefore = getDayBefore(yesterday)

// Mock records for a single day with varying in-range and out-of-range values
const mockRecordsForSingleDay: GlucoseRecord[] = [
  getMockGlucoseRecord(midnight, 100), // in range
  getMockGlucoseRecord(oneAm, 110), // in range
  getMockGlucoseRecord(fiveAm, 120), // in range
  getMockGlucoseRecord(sixAm, 130), // in range
  getMockGlucoseRecord(elevenAm, 140), // in range
  getMockGlucoseRecord(twelvePm, 180), // in range (boundary)
  getMockGlucoseRecord(fivePm, 200), // out of range (high)
  getMockGlucoseRecord(sixPm, 200), // out of range (high)
  getMockGlucoseRecord(elevenPm, 250), // out of range (high)
]

// Generate records for a day that's completely in range
const mockRecordsForInRangeDay: GlucoseRecord[] = generateSingleValueGlucoseRecords(
  100,
  yesterday,
)

// Generate records for a day that's completely out of range
const mockRecordsForOutOfRangeDay: GlucoseRecord[] = generateSingleValueGlucoseRecords(
  200,
  dayBefore,
)

const allRecords = [...mockRecordsForSingleDay, ...mockRecordsForInRangeDay, ...mockRecordsForOutOfRangeDay]

beforeAll(() => {
  vi.setSystemTime(elevenFiftyEightPm)
})

const testPercentTimeInRangeStreak = (
  testName: string,
  streakFunction: (records: GlucoseRecord[], thresholds: Thresholds, streakFilterValue: number) => DailyStreakStats,
  records: GlucoseRecord[],
  thresholds: Thresholds,
  streakFilterValue: number,
  expectedPercentForCustomDay: number,
  expectedBestStreakLength: number,
  expectedCurrentStreakLength: number,
  expectedCurrentDayStatus: CurrentDayStatus,
) => {
  test(testName, () => {
    const result = streakFunction(records, thresholds, streakFilterValue)

    // Check the score for our custom day
    const customDay = result.scoredDays.find((day: ScoredDay) => day.date.toDateString() === midnight.toDateString())
    expect(customDay?.score).toBe(expectedPercentForCustomDay)

    // Check best streak
    if (result.bestStreak.length > 0) {
      expect(result.bestStreak.length, 'best streak length wrong').toBe(expectedBestStreakLength)
      expect(result.bestStreak[0].score, 'best streak first score wrong').toBe(100)
      expect(result.bestStreak[0].passesThreshold, 'best streak first day should be passing').toBe(true)
    }

    // Check current streak
    expect(result.currentStreak.scoredDays.length, 'expected current streak length wrong').toBe(expectedCurrentStreakLength)
    expect(result.currentStreak.currentDayStatus, 'expected current day status wrong').toBe(expectedCurrentDayStatus)
  })
}

// Test full day streak
testPercentTimeInRangeStreak(
  'percentTimeInRangeForFullDayStreak processes records correctly',
  percentTimeInRangeForFullDayStreak,
  allRecords,
  mockThresholds,
  70, // 70% threshold
  (6 / 9) * 100, // 6 in-range values out of 9 total for the custom day, exact value
  1, // Best streak of 1 day (yesterday only, day before is out of range)
  0, // Current streak of 1 day
  CurrentDayStatus.Pending,
)

// Test nights streak (00:00-05:59)
testPercentTimeInRangeStreak(
  'percentTimeInRangeForNightsStreak processes records correctly',
  percentTimeInRangeForNightsStreak,
  allRecords,
  mockThresholds,
  70,
  100, // All night values are in range
  2,
  1,
  CurrentDayStatus.Pass,
)

// Test mornings streak (06:00-11:59)
testPercentTimeInRangeStreak(
  'percentTimeInRangeForMorningsStreak processes records correctly',
  percentTimeInRangeForMorningsStreak,
  allRecords,
  mockThresholds,
  70,
  100, // All morning values are in range
  2,
  1,
  CurrentDayStatus.Pass,
)

// Test afternoons streak (12:00-17:59)
testPercentTimeInRangeStreak(
  'percentTimeInRangeForAfternoonsStreak processes records correctly',
  percentTimeInRangeForAfternoonsStreak,
  allRecords,
  mockThresholds,
  70,
  50, // 1 in range (boundary), 1 out of range
  1,
  0,
  CurrentDayStatus.Fail,
)

// Test evenings streak (18:00-23:59)
testPercentTimeInRangeStreak(
  'percentTimeInRangeForEveningsStreak processes records correctly',
  percentTimeInRangeForEveningsStreak,
  allRecords,
  mockThresholds,
  70,
  0, // All evening values are out of range
  1,
  0, // Current streak only includes yesterday, not today
  CurrentDayStatus.Pending, // Not past end time (23:59) yet
)

// Test edge cases
test('percentTimeInRangeGame handles empty record list', () => {
  const result = percentTimeInRangeForFullDayStreak([], mockThresholds, 70)
  expect(result.scoredDays).toHaveLength(0)
  expect(result.bestStreak).toHaveLength(0)
  expect(result.currentStreak.scoredDays).toHaveLength(0)
})

test('percentTimeInRangeGame handles single record', () => {
  const singleRecord = [getMockGlucoseRecord(midnight, 100)]
  const result = percentTimeInRangeForFullDayStreak(singleRecord, mockThresholds, 70)
  expect(result.scoredDays).toHaveLength(1)
  expect(result.scoredDays[0].score).toBe(100)
  expect(result.currentStreak.scoredDays).toHaveLength(0) // Current day doesn't count in streaks
})

test('percentTimeInRangeGame handles boundary values', () => {
  const boundaryRecords = [
    getMockGlucoseRecord(midnight, mockThresholds.low),
    getMockGlucoseRecord(oneAm, mockThresholds.high),
  ]
  const result = percentTimeInRangeForFullDayStreak(boundaryRecords, mockThresholds, 70)
  expect(result.scoredDays[0].score).toBe(100) // Both values should be considered in range
})
