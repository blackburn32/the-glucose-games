import { describe, it, expect } from 'vitest'
import { groupRecordsByDay } from './groupRecords'
import type { GlucoseRecord } from '~/types/glucoseRecord'

describe('groupRecordsByDay', () => {
  it('should group records by day correctly', () => {
    const records: GlucoseRecord[] = [
      { value: 100, created: new Date('2024-01-01T10:00:00'), x: 0, y: 0, provider: 'test' },
      { value: 110, created: new Date('2024-01-01T11:00:00'), x: 1, y: 1, provider: 'test' },
      { value: 120, created: new Date('2024-01-02T10:00:00'), x: 2, y: 2, provider: 'test' },
    ]

    const result = groupRecordsByDay(records)

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['1/1/2024']).toHaveLength(2)
    expect(result['1/2/2024']).toHaveLength(1)
  })

  it('should handle empty records array', () => {
    const records: GlucoseRecord[] = []
    const result = groupRecordsByDay(records)
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('should handle records from same day but different times', () => {
    const records: GlucoseRecord[] = [
      { value: 100, created: new Date('2024-01-01T00:00:00'), x: 0, y: 0, provider: 'test' },
      { value: 110, created: new Date('2024-01-01T23:59:59'), x: 1, y: 1, provider: 'test' },
    ]

    const result = groupRecordsByDay(records)

    expect(Object.keys(result)).toHaveLength(1)
    expect(result['1/1/2024']).toHaveLength(2)
  })
})
