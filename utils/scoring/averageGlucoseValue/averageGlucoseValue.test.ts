import { test, expect } from 'vitest'
import { scoreRecordsByAverageGlucose } from '~/utils/scoring/averageGlucoseValue/averageGlucoseValue'
import { toGlucoseRecord } from '~/utils/generators/utils'

test('scoring/averageGlucoseValue.averageGlucoseValue', async () => {
  const date = new Date()
  const singleRecord = [
    toGlucoseRecord(100, date),
  ]
  expect(scoreRecordsByAverageGlucose(singleRecord)).toBe(100)

  const multipleRecords = [
    toGlucoseRecord(100, date),
    toGlucoseRecord(150, date),
    toGlucoseRecord(50, date),
  ]
  expect(scoreRecordsByAverageGlucose(multipleRecords)).toBe(100)

  const multipleRecords2 = [
    toGlucoseRecord(100, date),
    toGlucoseRecord(150, date),
    toGlucoseRecord(50, date),
    toGlucoseRecord(200, date),
  ]
  expect(scoreRecordsByAverageGlucose(multipleRecords2)).toBe(125)
})
