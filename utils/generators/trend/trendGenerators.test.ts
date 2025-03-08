import { test, expect } from 'vitest'
import { generateTrend } from './trendGenerators'
import type { GlucoseGeneratorConfig } from '~/utils/generators/config/generatorConfig'

test('generateTrend creates an array with the specified count', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 5,
  }
  const result = generateTrend(config, 100, 150, 10, true)
  expect(result).toHaveLength(10)
})

test('generateTrend follows increasing trend', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 0, // Set to 0 to make test deterministic
  }
  const result = generateTrend(config, 100, 150, 5, true)

  // Check that each value is greater than the previous
  for (let i = 1; i < result.length; i++) {
    expect(result[i]).toBeGreaterThan(result[i - 1])
  }
})

test('generateTrend follows decreasing trend', () => {
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange: 0, // Set to 0 to make test deterministic
  }
  const result = generateTrend(config, 150, 100, 5, false)

  // Check that each value is less than the previous
  for (let i = 1; i < result.length; i++) {
    expect(result[i]).toBeLessThan(result[i - 1])
  }
})

test('generateTrend respects maxChange parameter', () => {
  const maxChange = 5
  const config: GlucoseGeneratorConfig = {
    average: 100,
    min: 70,
    max: 180,
    maxChange,
  }
  const startValue = 100
  const endValue = 150
  const count = 5

  // Run multiple times to account for randomness
  for (let i = 0; i < 100; i++) {
    const result = generateTrend(config, startValue, endValue, count, true)
    const expectedBase = startValue + ((endValue - startValue) / count) * (count - 1)

    // The last value should be within maxChange of the expected linear value
    expect(Math.abs(result[count - 1] - expectedBase)).toBeLessThanOrEqual(maxChange)
  }
})
