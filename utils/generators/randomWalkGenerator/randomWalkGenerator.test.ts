import { test, expect, beforeEach, vi } from 'vitest'
import type { GlucoseGeneratorConfig } from '../config/generatorConfig'
import { generateRandomWalk } from './randomWalkGenerator'

// Mock Date.now() to ensure consistent timestamps
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
})

test('generateRandomWalk creates correct number of records', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 5,
  }
  const result = generateRandomWalk(config, 10)
  expect(result).toHaveLength(10)
})

test('generateRandomWalk respects min/max boundaries', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 50, // Large maxChange to force hitting boundaries
  }

  // Run multiple times to account for randomness
  for (let i = 0; i < 100; i++) {
    const result = generateRandomWalk(config, 50)

    // Check all values are within bounds
    result.forEach((record) => {
      expect(record.value).toBeGreaterThanOrEqual(config.min)
      expect(record.value).toBeLessThanOrEqual(config.max)
    })
  }
})

test('generateRandomWalk respects maxChange parameter', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 5,
  }

  // Run multiple times to account for randomness
  for (let i = 0; i < 100; i++) {
    const result = generateRandomWalk(config, 20)

    // Check consecutive values don't change more than maxChange
    // Note: Values are in reverse chronological order
    for (let j = 1; j < result.length; j++) {
      const change = Math.abs(result[j].value - result[j - 1].value)
      expect(change).toBeLessThanOrEqual(config.maxChange)
    }
  }
})

test('generateRandomWalk starts from average', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 5,
  }

  // Run multiple times to account for randomness
  for (let i = 0; i < 100; i++) {
    const result = generateRandomWalk(config, 10)
    // Last value in array is actually the first generated value due to reverse()
    expect(Math.abs(result[result.length - 1].value - config.average)).toBeLessThanOrEqual(config.maxChange)
  }
})

test('generateRandomWalk creates records with correct time intervals', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 5,
  }
  const minutesBetweenRecords = 30
  const result = generateRandomWalk(config, 3, minutesBetweenRecords)

  // After reverse(), records are in ascending chronological order:
  // result[0] is oldest (start - 2*interval)
  // result[1] is middle (start - interval)
  // result[2] is newest (start)
  const interval = minutesBetweenRecords * 60 * 1000
  expect(result[1].created.getTime() - result[0].created.getTime()).toBe(interval)
  expect(result[2].created.getTime() - result[1].created.getTime()).toBe(interval)
})

test('generateRandomWalk handles trend reversals near boundaries', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 10,
  }

  // Force values near boundaries by starting at extreme values
  const lowConfig = { ...config, average: config.min + 5 }
  const highConfig = { ...config, average: config.max - 5 }

  // Run multiple times to verify trend reversals
  for (let i = 0; i < 50; i++) {
    const lowResult = generateRandomWalk(lowConfig, 20)
    const highResult = generateRandomWalk(highConfig, 20)

    // Verify that values don't get stuck at boundaries
    expect(lowResult.some(r => r.value > lowConfig.average)).toBe(true)
    expect(highResult.some(r => r.value < highConfig.average)).toBe(true)
  }
})
