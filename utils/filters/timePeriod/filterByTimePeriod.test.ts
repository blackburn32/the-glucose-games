import { test, expect } from 'vitest'
import { toGlucoseRecord } from '~/utils/glucoseGenerator'
import { filterRecordsByTimePeriod, isTimeInRange } from '~/utils/filters/timePeriod/filterByTimePeriod'

test('filters/timePeriod/filterByTimePeriod.isTimeInRange', async () => {
  const midnight = new Date('2022-01-01T00:00:00')
  const oneAM = new Date('2022-01-01T01:00:00')
  const oneThirtyAM = new Date('2022-01-01T01:30:00')
  const noon = new Date('2022-01-01T12:00:00')
  const onePM = new Date('2022-01-01T13:00:00')
  const elevenPM = new Date('2022-01-01T23:00:00')

  // In range
  expect(isTimeInRange(midnight, 0, 0, 6, 0)).toBe(true)
  expect(isTimeInRange(oneAM, 0, 0, 6, 0)).toBe(true)
  expect(isTimeInRange(oneThirtyAM, 0, 0, 6, 0)).toBe(true)

  // Out of range
  expect(isTimeInRange(noon, 0, 0, 6, 0)).toBe(false)
  expect(isTimeInRange(onePM, 0, 0, 6, 0)).toBe(false)
  expect(isTimeInRange(elevenPM, 0, 0, 6, 0)).toBe(false)
  expect(isTimeInRange(oneAM, 1, 30, 12, 0)).toBe(false)

  // On range, inclusive on both ends
  expect(isTimeInRange(oneThirtyAM, 1, 30, 12, 0)).toBe(true)
  expect(isTimeInRange(oneThirtyAM, 0, 30, 1, 30)).toBe(true)
})

test('filters/filterByTimeInRange.filterRecordsByTimePeriod', async () => {
  const startHours = 0
  const startMinutes = 15
  const endHours = 6
  const endMinutes = 30

  const validRecords = [
    new Date('2022-01-01T00:15:00'),
    new Date('2022-01-01T00:16:00'),
    new Date('2022-01-01T00:30:00'),
    new Date('2022-01-01T01:00:00'),
    new Date('2022-01-01T06:00:00'),
    new Date('2022-01-01T06:29:00'),
    new Date('2022-01-01T06:30:00'),
  ].map(date => toGlucoseRecord(100, date))

  const invalidRecords = [
    new Date('2022-01-01T00:00:00'),
    new Date('2022-01-01T00:14:00'),
    new Date('2022-01-01T06:31:00'),
    new Date('2022-01-01T06:59:00'),
  ].map(date => toGlucoseRecord(100, date))

  const allRecords = validRecords.concat(invalidRecords)

  expect(filterRecordsByTimePeriod(allRecords, startHours, startMinutes, endHours, endMinutes)).toEqual(validRecords)
})
