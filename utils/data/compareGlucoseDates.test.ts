import { expect, describe, it } from 'vitest'
import { compareGlucoseDates } from '~/utils/data/compareGlucoseDates'
import { getMockGlucoseRecord } from '~/utils/test/testUtils'

describe('compareGlucoseDates', () => {
  it('should return a negative number when the first date is earlier than the second date', () => {
    const recordA = getMockGlucoseRecord(new Date('2023-01-01T00:00:00Z'))
    const recordB = getMockGlucoseRecord(new Date('2023-01-02T00:00:00Z'))
    expect(compareGlucoseDates(recordA, recordB)).toBeLessThan(0)
  })

  it('should return a positive number when the first date is later than the second date', () => {
    const recordA = getMockGlucoseRecord(new Date('2023-01-02T00:00:00Z'))
    const recordB = getMockGlucoseRecord(new Date('2023-01-01T00:00:00Z'))
    expect(compareGlucoseDates(recordA, recordB)).toBeGreaterThan(0)
  })

  it('should return zero when both dates are the same', () => {
    const recordA = getMockGlucoseRecord(new Date('2023-01-02T00:00:00Z'))
    const recordB = getMockGlucoseRecord(new Date('2023-01-02T00:00:00Z'))
    expect(compareGlucoseDates(recordA, recordB)).toBe(0)
  })
})
