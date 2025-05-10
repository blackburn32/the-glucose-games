import { test, expect } from 'vitest'
import { countOutOfRangeTransitions, outOfRangeTransitionsForSemanticPeriods } from './outOfRangeGames'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { DEFAULT_THRESHOLDS, SemanticPeriods } from '~/types/constants'

const mockThresholds = DEFAULT_THRESHOLDS

const createMockRecord = (value: number, minutesAgo: number = 0): GlucoseRecord => ({
  value,
  created: new Date(Date.now() - minutesAgo * 60 * 1000),
  x: Date.now() - minutesAgo * 60 * 1000,
  y: value,
  provider: 'test',
})

test('countOutOfRangeTransitions counts transitions correctly', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(100, 50), // in range
    createMockRecord(80, 40), // in range
    createMockRecord(65, 30), // out of range (low)
    createMockRecord(90, 20), // in range
    createMockRecord(190, 10), // out of range (high)
    createMockRecord(140, 0), // in range
  ]

  const transitions = countOutOfRangeTransitions(records, mockThresholds)
  expect(transitions).toBe(2) // 2 transitions: in->out->in->out
})

test('countOutOfRangeTransitions handles empty record list', () => {
  const emptyRecords: GlucoseRecord[] = []
  const transitions = countOutOfRangeTransitions(emptyRecords, mockThresholds)
  expect(transitions).toBe(0)
})

test('countOutOfRangeTransitions handles single record', () => {
  const singleRecord = [createMockRecord(100, 0)]
  const transitions = countOutOfRangeTransitions(singleRecord, mockThresholds)
  expect(transitions).toBe(0)
})

test('countOutOfRangeTransitions handles boundary values', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(mockThresholds.low, 30), // exactly at low threshold (out of range)
    createMockRecord(mockThresholds.low + 1, 20), // just above low threshold (in range)
    createMockRecord(mockThresholds.low - 1, 10), // just below low threshold (out of range)
    createMockRecord(mockThresholds.high, 10), // exactly at high threshold (out of range)
    createMockRecord(mockThresholds.high - 1, 0), // just below high threshold (in range)
    createMockRecord(mockThresholds.high + 1, -10), // just above high threshold (out of range)
  ]

  const transitions = countOutOfRangeTransitions(records, mockThresholds)
  expect(transitions).toBe(3) // start out -> in -> out -> in -> out
})

test('countOutOfRangeTransitions handles multiple consecutive out-of-range values', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(100, 50), // in range
    createMockRecord(65, 40), // out of range (low)
    createMockRecord(60, 30), // out of range (low)
    createMockRecord(55, 20), // out of range (low)
    createMockRecord(90, 10), // in range
    createMockRecord(85, 0), // in range
    createMockRecord(190, -10), // out of range (high)
    createMockRecord(140, -20), // in range
  ]

  const transitions = countOutOfRangeTransitions(records, mockThresholds)
  expect(transitions).toBe(2) // 2 transition: in->out->in->out->in
})

test('outOfRangeGameForSemanticPeriods returns correct structure', () => {
  const records: GlucoseRecord[] = [
    createMockRecord(100, 50),
    createMockRecord(65, 40),
    createMockRecord(90, 30),
    createMockRecord(190, 20),
    createMockRecord(140, 10),
    createMockRecord(85, 0),
  ]

  const result = outOfRangeTransitionsForSemanticPeriods(records, mockThresholds)

  // Check that we have results for all semantic periods
  SemanticPeriods.forEach((period) => {
    expect(result[period.id]).toBeDefined()
  })

  // Check that each period has the expected structure
  SemanticPeriods.forEach((period) => {
    const periodResult = result[period.id]
    expect(periodResult).toHaveProperty('bestDay')
    expect(periodResult).toHaveProperty('bestStreak')
    expect(periodResult).toHaveProperty('currentStreak')
    expect(periodResult).toHaveProperty('scoredDays')
  })
})

test('outOfRangeGameForSemanticPeriods handles empty record list', () => {
  const emptyRecords: GlucoseRecord[] = []
  const result = outOfRangeTransitionsForSemanticPeriods(emptyRecords, mockThresholds)

  // Check that we still have results for all periods
  SemanticPeriods.forEach((period) => {
    expect(result[period.id]).toBeDefined()
  })

  // Check that each period has empty results
  SemanticPeriods.forEach((period) => {
    const periodResult = result[period.id]
    expect(periodResult.scoredDays).toHaveLength(0)
    expect(periodResult.bestStreak).toHaveLength(0)
    expect(periodResult.currentStreak.scoredDays).toHaveLength(0)
  })
})
