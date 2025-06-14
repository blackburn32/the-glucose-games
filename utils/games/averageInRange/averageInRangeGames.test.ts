import { test, expect, vi, beforeAll } from 'vitest'
import { averageInRangeForSemanticPeriods } from '~/utils/games/averageInRange/averageInRangeGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { createDate, getDayBefore, getMockGlucoseRecord } from '~/utils/test/testUtils'
import { CurrentDayStatus, DEFAULT_THRESHOLDS } from '~/types/constants'
import { generateSingleValueGlucoseRecords } from '~/utils/generators/singleValue/singleValueGenerator'
import { FullDayTiming, NightTiming, MorningTiming, AfternoonTiming, EveningTiming } from '~/types/timing'
import { groupRecordsByDay } from '~/utils/records/groupRecords'

const mockThresholds = DEFAULT_THRESHOLDS

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

const mockRecordsForSingleDay: GlucoseRecord[] = [
  getMockGlucoseRecord(midnight, 100),
  getMockGlucoseRecord(oneAm, 110),
  getMockGlucoseRecord(fiveAm, 120),
  getMockGlucoseRecord(sixAm, 130),
  getMockGlucoseRecord(elevenAm, 140),
  getMockGlucoseRecord(twelvePm, 180),
  getMockGlucoseRecord(fivePm, 200),
  getMockGlucoseRecord(sixPm, 200),
  getMockGlucoseRecord(elevenPm, 250),
]

export const getAverageForTimeRange = (records: GlucoseRecord[], startHour: number, endHour: number) => {
  const filteredRecords = records.filter(record => record.created.getHours() >= startHour && record.created.getHours() <= endHour)
  return filteredRecords.reduce((acc, record) => acc + record.value, 0) / filteredRecords.length
}

const mockRecordsForInRangeDay: GlucoseRecord[] = generateSingleValueGlucoseRecords(
  100,
  yesterday,
)

const mockRecordsForOutOfRangeDay: GlucoseRecord[] = generateSingleValueGlucoseRecords(
  200,
  dayBefore,
)

const allRecords = [...mockRecordsForSingleDay, ...mockRecordsForInRangeDay, ...mockRecordsForOutOfRangeDay]

beforeAll(() => {
  vi.setSystemTime(elevenFiftyEightPm)
})

const testAverageInRangeStreak = (
  testName: string,
  periodId: number,
  records: GlucoseRecord[],
  thresholds: Thresholds,
  expectedAverageForCustomDay: number,
  expectedBestStreakLength: number,
  expectedCurrentStreakLength: number,
  expectedCurrentDayStatus: CurrentDayStatus,
) => {
  test(testName, () => {
    const recordsGroupedByDay = groupRecordsByDay(records)
    const result = averageInRangeForSemanticPeriods(records, recordsGroupedByDay, thresholds)[periodId]
    const customDay = result.scoredDays.find(day => day.date.toDateString() === midnight.toDateString())
    expect(customDay?.score).toBe(expectedAverageForCustomDay)
    if (result.bestStreak.length > 0) {
      expect(result.bestStreak.length, 'best streak length wrong').toBe(expectedBestStreakLength)
      expect(result.bestStreak[0].score, 'best streak first score wrong').toBe(100)
      expect(result.bestStreak[0].passesThreshold, 'best streak first day should be passing').toBe(true)
    }
    expect(result.currentStreak.scoredDays.length, 'expected current streak length wrong').toBe(expectedCurrentStreakLength)
    expect(result.currentStreak.currentDayStatus, 'expected current day status wrong').toBe(expectedCurrentDayStatus)
  })
}

testAverageInRangeStreak(
  'averageInRangeForFullDayStreak should process records for multiple days',
  FullDayTiming.id,
  allRecords,
  mockThresholds,
  getAverageForTimeRange(mockRecordsForSingleDay, 0, 23),
  2,
  0,
  CurrentDayStatus.Pending,
)

testAverageInRangeStreak(
  'averageInRangeForNightsStreak should process records for multiple days',
  NightTiming.id,
  allRecords,
  mockThresholds,
  mockRecordsForSingleDay.filter(record => record.created.getHours() >= 0 && record.created.getHours() < 6).reduce((acc, record) => acc + record.value, 0) / mockRecordsForSingleDay.filter(record => record.created.getHours() >= 0 && record.created.getHours() < 6).length,
  2,
  1,
  CurrentDayStatus.Pass,
)

testAverageInRangeStreak(
  'averageInRangeForMorningsStreak should process records for multiple days',
  MorningTiming.id,
  allRecords,
  mockThresholds,
  mockRecordsForSingleDay.filter(record => record.created.getHours() >= 6 && record.created.getHours() < 12).reduce((acc, record) => acc + record.value, 0) / mockRecordsForSingleDay.filter(record => record.created.getHours() >= 6 && record.created.getHours() < 12).length,
  2,
  1,
  CurrentDayStatus.Pass,
)

testAverageInRangeStreak(
  'averageInRangeForAfternoonsStreak should process records for multiple days',
  AfternoonTiming.id,
  allRecords,
  mockThresholds,
  mockRecordsForSingleDay.filter(record => record.created.getHours() >= 12 && record.created.getHours() < 18).reduce((acc, record) => acc + record.value, 0) / mockRecordsForSingleDay.filter(record => record.created.getHours() >= 12 && record.created.getHours() < 18).length,
  1,
  0,
  CurrentDayStatus.Fail,
)

testAverageInRangeStreak(
  'averageInRangeForEveningsStreak should process records for multiple days',
  EveningTiming.id,
  allRecords,
  mockThresholds,
  mockRecordsForSingleDay.filter(record => record.created.getHours() >= 18 && record.created.getHours() < 24).reduce((acc, record) => acc + record.value, 0) / mockRecordsForSingleDay.filter(record => record.created.getHours() >= 18 && record.created.getHours() < 24).length,
  1,
  0,
  CurrentDayStatus.Pending,
)
