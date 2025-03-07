import { test, expect } from 'vitest'
import { toGlucoseRecord } from '~/utils/generators/utils'
import type { GlucoseRecord } from '~/types/glucoseRecord'

test('toGlucoseRecord creates a record with the correct value and date', () => {
  const value = 120
  const date = new Date('2023-01-01T00:00:00Z')
  const record: GlucoseRecord = toGlucoseRecord(value, date)

  expect(record.value).toBe(value)
  expect(record.created).toEqual(date)
})

test('toGlucoseRecord sets the correct x and y properties', () => {
  const value = 120
  const date = new Date('2023-01-01T00:00:00Z')
  const record: GlucoseRecord = toGlucoseRecord(value, date)

  expect(record.x).toBe(date.getTime())
  expect(record.y).toBe(value)
})

test('toGlucoseRecord sets the provider to "generator"', () => {
  const value = 120
  const date = new Date('2023-01-01T00:00:00Z')
  const record: GlucoseRecord = toGlucoseRecord(value, date)

  expect(record.provider).toBe('generator')
})
