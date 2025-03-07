import { test, expect } from 'vitest'
import { generateSingleValueGlucoseRecords } from '~/utils/generators/singleValue/singleValueGenerator'
import type { GlucoseRecord } from '~/types/glucoseRecord'

test('generateSingleValueGlucoseRecords generates records with the correct value', () => {
  const value = 100
  const date = new Date('2023-01-01T00:00:00Z')
  const count = 10
  const interval = 5
  const records: GlucoseRecord[] = generateSingleValueGlucoseRecords(value, date, count, interval)

  records.forEach((record) => {
    expect(record.value).toBe(value)
  })
})

test('generateSingleValueGlucoseRecords generates records with the correct interval', () => {
  const value = 100
  const date = new Date('2023-01-01T00:00:00Z')
  const count = 10
  const interval = 5
  const records: GlucoseRecord[] = generateSingleValueGlucoseRecords(value, date, count, interval)

  for (let i = 1; i < records.length; i++) {
    const previousRecord = records[i - 1]
    const currentRecord = records[i]
    const expectedTime = new Date(previousRecord.created.getTime() + interval * 60 * 1000)
    expect(currentRecord.created.getTime()).toBe(expectedTime.getTime())
  }
})

test('generateSingleValueGlucoseRecords generates records with the correct date', () => {
  const value = 100
  const date = new Date('2023-01-01T00:00:00Z')
  const count = 10
  const interval = 5
  const records: GlucoseRecord[] = generateSingleValueGlucoseRecords(value, date, count, interval)

  expect(records[0].created).toEqual(date)
})
