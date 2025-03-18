import { test, expect, vi, beforeAll } from 'vitest'
import { getScoredGames } from './scoredGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { Thresholds } from '~/types/thresholds'
import { createDate, getDayBefore, getMockGlucoseRecord } from '~/utils/test/testUtils'
import { CurrentDayStatus } from '~/types/constants'

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

// Create records for yesterday (one per time period, all in range)
const mockRecordsForInRangeDay: GlucoseRecord[] = [
  getMockGlucoseRecord(new Date(yesterday.setHours(2)), 100), // night
  getMockGlucoseRecord(new Date(yesterday.setHours(8)), 100), // morning
  getMockGlucoseRecord(new Date(yesterday.setHours(14)), 100), // afternoon
  getMockGlucoseRecord(new Date(yesterday.setHours(20)), 100), // evening
]

// Create records for day before (one per time period, all out of range)
const mockRecordsForOutOfRangeDay: GlucoseRecord[] = [
  getMockGlucoseRecord(new Date(dayBefore.setHours(2)), 200), // night
  getMockGlucoseRecord(new Date(dayBefore.setHours(8)), 200), // morning
  getMockGlucoseRecord(new Date(dayBefore.setHours(14)), 200), // afternoon
  getMockGlucoseRecord(new Date(dayBefore.setHours(20)), 200), // evening
]

const allRecords = [...mockRecordsForSingleDay, ...mockRecordsForInRangeDay, ...mockRecordsForOutOfRangeDay]

beforeAll(() => {
  vi.setSystemTime(elevenFiftyEightPm)
})

test('getScoredGames returns correctly structured results', () => {
  const result = getScoredGames(allRecords, mockThresholds)

  // Check that all expected properties exist
  expect(result).toHaveProperty('dailyStreakStats')
  expect(result).toHaveProperty('contiguousStreakStats')

  // Check daily streak stats structure
  expect(result.dailyStreakStats).toHaveProperty('averageInRangeForAfternoons')
  expect(result.dailyStreakStats).toHaveProperty('averageInRangeForEvenings')
  expect(result.dailyStreakStats).toHaveProperty('averageInRangeForFullDay')
  expect(result.dailyStreakStats).toHaveProperty('averageInRangeForMornings')
  expect(result.dailyStreakStats).toHaveProperty('averageInRangeForNights')
  expect(result.dailyStreakStats).toHaveProperty('percentTimeInRangeForAfternoons')
  expect(result.dailyStreakStats).toHaveProperty('percentTimeInRangeForEvenings')
  expect(result.dailyStreakStats).toHaveProperty('percentTimeInRangeForFullDay')
  expect(result.dailyStreakStats).toHaveProperty('percentTimeInRangeForMornings')
  expect(result.dailyStreakStats).toHaveProperty('percentTimeInRangeForNights')

  // Check contiguous streak stats structure
  expect(result.contiguousStreakStats).toHaveProperty('noHighsStreaks')
  expect(result.contiguousStreakStats).toHaveProperty('noHighsOrLowsStreaks')
  expect(result.contiguousStreakStats).toHaveProperty('noLowsStreaks')
})

test('getScoredGames calculates daily streak stats correctly', () => {
  const result = getScoredGames(allRecords, mockThresholds)

  // Test full day stats
  expect(result.dailyStreakStats.averageInRangeForFullDay.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Pending)
  expect(result.dailyStreakStats.percentTimeInRangeForFullDay.scoredDays.find(day =>
    day.date.toDateString() === midnight.toDateString(),
  )?.score).toBe((6 / 9) * 100)

  // Test night stats (00:00-05:59)
  expect(result.dailyStreakStats.averageInRangeForNights.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Pass)
  expect(result.dailyStreakStats.percentTimeInRangeForNights.scoredDays.find(day =>
    day.date.toDateString() === midnight.toDateString(),
  )?.score).toBe(100) // All night values are in range

  // Test morning stats (06:00-11:59)
  expect(result.dailyStreakStats.averageInRangeForMornings.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Pass)
  expect(result.dailyStreakStats.percentTimeInRangeForMornings.scoredDays.find(day =>
    day.date.toDateString() === midnight.toDateString(),
  )?.score).toBe(100) // All morning values are in range

  // Test afternoon stats (12:00-17:59)
  expect(result.dailyStreakStats.averageInRangeForAfternoons.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Fail)
  expect(result.dailyStreakStats.percentTimeInRangeForAfternoons.scoredDays.find(day =>
    day.date.toDateString() === midnight.toDateString(),
  )?.score).toBe(50) // 1 in range (boundary), 1 out of range

  // Test evening stats (18:00-23:59)
  expect(result.dailyStreakStats.averageInRangeForEvenings.currentStreak.currentDayStatus).toBe(CurrentDayStatus.Pending)
  expect(result.dailyStreakStats.percentTimeInRangeForEvenings.scoredDays.find(day =>
    day.date.toDateString() === midnight.toDateString(),
  )?.score).toBe(0) // All evening values are out of range
})

test('getScoredGames calculates contiguous streak stats correctly', () => {
  const result = getScoredGames(allRecords, mockThresholds)

  // Test no highs streaks
  expect(result.contiguousStreakStats.noHighsStreaks.currentlyInStreak).toBe(false)
  expect(result.contiguousStreakStats.noHighsStreaks.currentStreak).toHaveLength(0)
  expect(result.contiguousStreakStats.noHighsStreaks.longestStreak).toHaveLength(6) // First 6 values of mockRecordsForSingleDay

  // Test no lows streaks
  expect(result.contiguousStreakStats.noLowsStreaks.currentlyInStreak).toBe(true)
  expect(result.contiguousStreakStats.noLowsStreaks.currentStreak).toHaveLength(17) // All values from today and yesterday (9 + 4 + 4)
  expect(result.contiguousStreakStats.noLowsStreaks.longestStreak).toHaveLength(17)

  // Test no highs or lows streaks
  expect(result.contiguousStreakStats.noHighsOrLowsStreaks.currentlyInStreak).toBe(false)
  expect(result.contiguousStreakStats.noHighsOrLowsStreaks.currentStreak).toHaveLength(0)
  expect(result.contiguousStreakStats.noHighsOrLowsStreaks.longestStreak).toHaveLength(6) // First 6 values of mockRecordsForSingleDay
})

test('getScoredGames handles empty record list', () => {
  const result = getScoredGames([], mockThresholds)

  // Check daily streak stats
  Object.values(result.dailyStreakStats).forEach((stats) => {
    expect(stats.scoredDays).toHaveLength(0)
    expect(stats.bestStreak).toHaveLength(0)
    expect(stats.currentStreak.scoredDays).toHaveLength(0)
  })

  // Check contiguous streak stats
  Object.values(result.contiguousStreakStats).forEach((stats) => {
    expect(stats.currentStreak).toHaveLength(0)
    expect(stats.longestStreak).toHaveLength(0)
    expect(stats.currentlyInStreak).toBe(false)
  })
})

test('getScoredGames handles single record', () => {
  const singleRecord = [getMockGlucoseRecord(midnight, 100)]
  const result = getScoredGames(singleRecord, mockThresholds)

  // Check daily streak stats for the time period containing the record (night)
  expect(result.dailyStreakStats.averageInRangeForNights.scoredDays).toHaveLength(1)
  expect(result.dailyStreakStats.averageInRangeForNights.scoredDays[0].score).toBe(100)
  expect(result.dailyStreakStats.percentTimeInRangeForNights.scoredDays).toHaveLength(1)
  expect(result.dailyStreakStats.percentTimeInRangeForNights.scoredDays[0].score).toBe(100)

  // Check contiguous streak stats
  expect(result.contiguousStreakStats.noHighsStreaks.currentStreak).toHaveLength(1)
  expect(result.contiguousStreakStats.noLowsStreaks.currentStreak).toHaveLength(1)
  expect(result.contiguousStreakStats.noHighsOrLowsStreaks.currentStreak).toHaveLength(1)
})
