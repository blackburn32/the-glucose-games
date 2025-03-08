import { test, expect } from 'vitest'
import { getLastNight } from '~/utils/timing/timeSlicers'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getMockGlucoseRecord } from '~/utils/test/testUtils'

test('timing/timeSlicers.getLastNight should include records between 0:00 - 6:00', () => {
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
