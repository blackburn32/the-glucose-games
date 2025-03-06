import { test, expect } from 'vitest'
import { scoreRecordsByPercentTimeInRange } from '~/utils/scoring/percentTimeInRange/percentTimeInRange'
import type { Thresholds } from '~/types/thresholds'
import { toGlucoseRecord } from '~/utils/generators/glucoseGenerator'

test('scoring/percentTimeInRange.percentTimeInRange', async () => {
  const date = new Date()
  const thresholds: Thresholds = {
    low: 70,
    high: 180,
  }

  const singleInRangeRecord = [
    100,
  ].map(value => toGlucoseRecord(value, date))
  expect(scoreRecordsByPercentTimeInRange(singleInRangeRecord, thresholds)).toBe(100)

  const singleOutOfRangeRecord = [
    200,
  ].map(value => toGlucoseRecord(value, date))
  expect(scoreRecordsByPercentTimeInRange(singleOutOfRangeRecord, thresholds)).toBe(0)

  const multipleRecords = [
    100,
    150,
    120,
  ].map(value => toGlucoseRecord(value, date))
  expect(scoreRecordsByPercentTimeInRange(multipleRecords, thresholds)).toBe(100)

  const multipleRecords2 = [
    100,
    150,
    50,
    200,
  ].map(value => toGlucoseRecord(value, date))
  expect(scoreRecordsByPercentTimeInRange(multipleRecords2, thresholds)).toBe(50)
})
