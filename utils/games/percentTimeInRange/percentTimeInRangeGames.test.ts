import { test, expect, vi, beforeAll } from 'vitest'
import {
  percentTimeInRangeForSemanticPeriods,
} from './percentTimeInRangeGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { createDate, getDayBefore, getMockGlucoseRecord } from '~/utils/test/testUtils'
import { CurrentDayStatus, DEFAULT_THRESHOLDS } from '~/types/constants'
import { generateSingleValueGlucoseRecords } from '~/utils/generators/singleValue/singleValueGenerator'
import type { ScoredDay } from '~/types/scoredDay'
import { FullDayTiming, NightTiming, MorningTiming, AfternoonTiming, EveningTiming } from '~/types/timing'

const mockThresholds: Thresholds = DEFAULT_THRESHOLDS

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
  periodId: number,
  records: GlucoseRecord[],
  thresholds: Thresholds,
  streakFilterValue: number,
  expectedPercentForCustomDay: number,
  expectedBestStreakLength: number,
  expectedCurrentStreakLength: number,
  expectedCurrentDayStatus: CurrentDayStatus,
) => {
  test(testName, () => {
    const result = percentTimeInRangeForSemanticPeriods(records, thresholds)[periodId]
    const customDay = result.scoredDays.find((day: ScoredDay) => day.date.toDateString() === midnight.toDateString())
    expect(customDay?.score).toBe(expectedPercentForCustomDay)
    if (result.bestStreak.length > 0) {
      expect(result.bestStreak.length, 'best streak length wrong').toBe(expectedBestStreakLength)
      expect(result.bestStreak[0].score, 'best streak first score wrong').toBe(100)
      expect(result.bestStreak[0].passesThreshold, 'best streak first day should be passing').toBe(true)
    }
    expect(result.currentStreak.scoredDays.length, 'expected current streak length wrong').toBe(expectedCurrentStreakLength)
    expect(result.currentStreak.currentDayStatus, 'expected current day status wrong').toBe(expectedCurrentDayStatus)
  })
}

testPercentTimeInRangeStreak(
  'percentTimeInRangeForFullDayStreak processes records correctly',
  FullDayTiming.id,
  allRecords,
  mockThresholds,
  70,
  (6 / 9) * 100,
  1,
  0,
  CurrentDayStatus.Pending,
)

testPercentTimeInRangeStreak(
  'percentTimeInRangeForNightsStreak processes records correctly',
  NightTiming.id,
  allRecords,
  mockThresholds,
  70,
  100,
  2,
  1,
  CurrentDayStatus.Pass,
)

testPercentTimeInRangeStreak(
  'percentTimeInRangeForMorningsStreak processes records correctly',
  MorningTiming.id,
  allRecords,
  mockThresholds,
  70,
  100,
  2,
  1,
  CurrentDayStatus.Pass,
)

testPercentTimeInRangeStreak(
  'percentTimeInRangeForAfternoonsStreak processes records correctly',
  AfternoonTiming.id,
  allRecords,
  mockThresholds,
  70,
  50,
  1,
  0,
  CurrentDayStatus.Fail,
)

testPercentTimeInRangeStreak(
  'percentTimeInRangeForEveningsStreak processes records correctly',
  EveningTiming.id,
  allRecords,
  mockThresholds,
  70,
  0,
  1,
  0,
  CurrentDayStatus.Pending,
)

test('percentTimeInRangeGame handles empty record list', () => {
  const result = percentTimeInRangeForSemanticPeriods([], mockThresholds)[FullDayTiming.id]
  expect(result.scoredDays).toHaveLength(0)
  expect(result.bestStreak).toHaveLength(0)
  expect(result.currentStreak.scoredDays).toHaveLength(0)
})

test('percentTimeInRangeGame handles single record', () => {
  const singleRecord = [getMockGlucoseRecord(midnight, 100)]
  const result = percentTimeInRangeForSemanticPeriods(singleRecord, mockThresholds)[FullDayTiming.id]
  expect(result.scoredDays).toHaveLength(1)
  expect(result.scoredDays[0].score).toBe(100)
  expect(result.currentStreak.scoredDays).toHaveLength(0)
})

test('percentTimeInRangeGame handles boundary values', () => {
  const boundaryRecords = [
    getMockGlucoseRecord(midnight, mockThresholds.low),
    getMockGlucoseRecord(oneAm, mockThresholds.high),
  ]
  const result = percentTimeInRangeForSemanticPeriods(boundaryRecords, mockThresholds)[FullDayTiming.id]
  expect(result.scoredDays[0].score).toBe(100)
})
