import { test, expect, describe } from 'vitest'
import { getLastNight, getRecordsWithSameDate, getTimestampsBetweenDatesUsingDuration } from '~/utils/timing/timeSlicers'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getMockGlucoseRecord } from '~/utils/test/testUtils'

describe('timing/timeSlicers', () => {
  describe('getLastNight', () => {
    test('should include records between 0:00 - 6:00', () => {
      const mockDate = new Date('2023-10-10')
      mockDate.setHours(9)

      const yesterday = new Date(mockDate)
      yesterday.setDate(yesterday.getDate() - 1)

      const before6 = new Date(mockDate)
      before6.setHours(5)

      const after6 = new Date(mockDate)
      after6.setHours(7)

      const beforeMidnight = getMockGlucoseRecord(yesterday)
      const before6AM = getMockGlucoseRecord(before6)
      const after6AM = getMockGlucoseRecord(after6)

      const records: GlucoseRecord[] = [
        beforeMidnight,
        before6AM,
        after6AM,
      ]

      const result = getLastNight(records, mockDate)
      expect(result).toEqual([
        before6AM,
      ])
    })

    test('should use previous day when current time is before 1 AM', () => {
      const mockDate = new Date('2023-10-10')
      mockDate.setHours(0, 30) // 12:30 AM

      const yesterday = new Date(mockDate)
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(4) // 4 AM yesterday

      const today = new Date(mockDate)
      today.setHours(4) // 4 AM today

      const yesterdayRecord = getMockGlucoseRecord(yesterday)
      const todayRecord = getMockGlucoseRecord(today)

      const records: GlucoseRecord[] = [
        yesterdayRecord,
        todayRecord,
      ]

      const result = getLastNight(records, mockDate)
      expect(result).toEqual([
        yesterdayRecord,
      ])
    })

    test('should handle empty records array', () => {
      const mockDate = new Date('2023-10-10')
      const result = getLastNight([], mockDate)
      expect(result).toEqual([])
    })
  })

  describe('getRecordsWithSameDate', () => {
    test('should return records from the same date', () => {
      const date = new Date('2023-10-10T12:00:00Z')

      const sameDate1 = new Date('2023-10-10T08:00:00Z')
      const sameDate2 = new Date('2023-10-10T16:00:00Z')
      const differentDate = new Date('2023-10-11T12:00:00Z')

      const records: GlucoseRecord[] = [
        getMockGlucoseRecord(sameDate1),
        getMockGlucoseRecord(sameDate2),
        getMockGlucoseRecord(differentDate),
      ]

      const result = getRecordsWithSameDate(records, date)
      expect(result).toHaveLength(2)
      expect(result).toEqual([
        getMockGlucoseRecord(sameDate1),
        getMockGlucoseRecord(sameDate2),
      ])
    })

    test('should handle empty records array', () => {
      const date = new Date('2023-10-10')
      const result = getRecordsWithSameDate([], date)
      expect(result).toEqual([])
    })
  })

  describe('getTimestampsBetweenDatesUsingDuration', () => {
    test('should generate timestamps at specified intervals', () => {
      const start = new Date('2023-10-10T00:00:00Z')
      const end = new Date('2023-10-10T02:00:00Z')
      const interval = 1000 * 60 * 60 // 1 hour in milliseconds

      const result = getTimestampsBetweenDatesUsingDuration(start, end, interval)

      expect(result).toEqual([
        start.getTime(),
        start.getTime() + interval,
      ])
    })

    test('should handle start date equal to end date', () => {
      const date = new Date('2023-10-10T00:00:00Z')
      const interval = 1000 * 60 * 60

      const result = getTimestampsBetweenDatesUsingDuration(date, date, interval)

      expect(result).toEqual([])
    })

    test('should handle start date after end date', () => {
      const start = new Date('2023-10-10T02:00:00Z')
      const end = new Date('2023-10-10T00:00:00Z')
      const interval = 1000 * 60 * 60

      const result = getTimestampsBetweenDatesUsingDuration(start, end, interval)

      expect(result).toEqual([])
    })
  })
})
