import { test, expect, vi, beforeAll } from 'vitest'
import { averageInRangeForFullDayStreak, averageInRangeForNightsStreak, averageInRangeForMorningsStreak, averageInRangeForAfternoonsStreak, averageInRangeForEveningsStreak } from '~/utils/games/averageInRange/averageInRangeGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { getMockGlucoseRecord } from '~/utils/test/testUtils'
import { CurrentDayStatus } from '~/types/constants'

const mockThresholds: Thresholds = {
  low: 70,
  high: 180,
}

const createDate = (hours: number, minutes: number = 0, startDate: Date = new Date('2023-10-10')) => {
  startDate.setHours(hours, minutes)
  return startDate
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
const mindightYesterday = createDate(0, 0, new Date('2023-10-09'))

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

const mockRecordsForMultipleDays: GlucoseRecord[] = [
  getMockGlucoseRecord(mindightYesterday, 100),
  ...mockRecordsForSingleDay,
]

beforeAll(() => {
  vi.setSystemTime(elevenFiftyEightPm)
})

test('averageInRangeForFullDayStreak should process records for the full day', () => {
  const result = averageInRangeForFullDayStreak(mockRecordsForSingleDay, mockThresholds)
  const expectedAverage = Math.round(mockRecordsForSingleDay.filter(record => record.created.getDate() == midnight.getDate()).reduce((acc, record) => acc + record.value, 0) / mockRecordsForSingleDay.length)
  expect(result.bestDay?.score).toBe(expectedAverage)
  expect(result.bestStreak.length).toBe(1)
  expect(result.bestStreak[0].score).toBe(expectedAverage)
  expect(result.bestStreak[0].passesThreshold).toBe(true)
  expect(result.currentStreak.scoredDays.length).toBe(1)
  expect(result.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Pending)
  const resultMultipleDays = averageInRangeForFullDayStreak(mockRecordsForMultipleDays, mockThresholds)
  expect(resultMultipleDays.bestDay?.score).toBe(100)
  expect(resultMultipleDays.bestStreak.length).toBe(2)
  expect(resultMultipleDays.bestStreak[0].score).toBe(100)
  expect(resultMultipleDays.bestStreak[0].passesThreshold).toBe(true)
  expect(resultMultipleDays.bestStreak[1].score).toBe(expectedAverage)
  expect(resultMultipleDays.bestStreak[1].passesThreshold).toBe(true)
})

test('averageInRangeForNightsStreak should process records for the night period', () => {
  const nightRecords = mockRecordsForSingleDay.filter(record => record.created.getHours() >= 0 && record.created.getHours() < 6)
  const result = averageInRangeForNightsStreak(mockRecordsForSingleDay, mockThresholds)
  const expectedAverage = Math.round(nightRecords.reduce((acc, record) => acc + record.value, 0) / nightRecords.length)
  expect(result.bestDay?.score).toBe(expectedAverage)
  expect(result.bestStreak.length).toBe(1)
  expect(result.bestStreak[0].score).toBe(expectedAverage)
  expect(result.bestStreak[0].passesThreshold).toBe(true)
  expect(result.currentStreak.scoredDays.length).toBe(1)
  expect(result.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Pass)
})

test('averageInRangeForMorningsStreak should process records for the morning period', () => {
  const morningRecords = mockRecordsForSingleDay.filter(record => record.created.getHours() >= 6 && record.created.getHours() < 12)
  const result = averageInRangeForMorningsStreak(mockRecordsForSingleDay, mockThresholds)
  const expectedAverage = Math.round(morningRecords.reduce((acc, record) => acc + record.value, 0) / morningRecords.length)
  expect(result.bestDay?.score).toBe(expectedAverage)
  expect(result.bestStreak.length).toBe(1)
  expect(result.bestStreak[0].score).toBe(expectedAverage)
  expect(result.bestStreak[0].passesThreshold).toBe(true)
  expect(result.currentStreak.scoredDays.length).toBe(1)
  expect(result.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Pass)
})

test('averageInRangeForAfternoonsStreak should process records for the afternoon period', () => {
  const afternoonRecords = mockRecordsForSingleDay.filter(record => record.created.getHours() >= 12 && record.created.getHours() < 18)
  const result = averageInRangeForAfternoonsStreak(mockRecordsForSingleDay, mockThresholds)
  const expectedAverage = Math.round(afternoonRecords.reduce((acc, record) => acc + record.value, 0) / afternoonRecords.length)
  expect(result.bestDay?.score).toBe(expectedAverage)
  expect(result.bestStreak.length).toBe(0)
  expect(result.currentStreak.scoredDays.length).toBe(0)
  expect(result.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Fail)
})

test('averageInRangeForEveningsStreak should process records for the evening period', () => {
  const eveningRecords = mockRecordsForSingleDay.filter(record => record.created.getHours() >= 18 && record.created.getHours() < 24)
  const result = averageInRangeForEveningsStreak(mockRecordsForSingleDay, mockThresholds)
  const expectedAverage = Math.round(eveningRecords.reduce((acc, record) => acc + record.value, 0) / eveningRecords.length)
  expect(result.bestDay?.score).toBe(expectedAverage)
  expect(result.bestStreak.length).toBe(0)
  expect(result.currentStreak.scoredDays.length).toBe(1)
  expect(result.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Failing)
})
