import { test, expect } from 'vitest'
import { StableGeneratorConfig, TrendsHighGeneratorConfig, RealisticGeneratorConfig } from './generatorConfig'

test('StableGeneratorConfig has correct values', () => {
  expect(StableGeneratorConfig).toEqual({
    average: 100,
    min: 80,
    max: 150,
    maxChange: 5,
  })
})

test('TrendsHighGeneratorConfig has correct values', () => {
  expect(TrendsHighGeneratorConfig).toEqual({
    average: 150,
    min: 120,
    max: 250,
    maxChange: 8,
  })
})

test('RealisticGeneratorConfig has correct values', () => {
  expect(RealisticGeneratorConfig).toEqual({
    average: 130,
    min: 55,
    max: 350,
    maxChange: 8,
  })
})

test('Generator configs have valid ranges', () => {
  // Test StableGeneratorConfig
  expect(StableGeneratorConfig.min).toBeLessThan(StableGeneratorConfig.average)
  expect(StableGeneratorConfig.max).toBeGreaterThan(StableGeneratorConfig.average)
  expect(StableGeneratorConfig.maxChange).toBeGreaterThan(0)

  // Test TrendsHighGeneratorConfig
  expect(TrendsHighGeneratorConfig.min).toBeLessThan(TrendsHighGeneratorConfig.average)
  expect(TrendsHighGeneratorConfig.max).toBeGreaterThan(TrendsHighGeneratorConfig.average)
  expect(TrendsHighGeneratorConfig.maxChange).toBeGreaterThan(0)

  // Test RealisticGeneratorConfig
  expect(RealisticGeneratorConfig.min).toBeLessThan(RealisticGeneratorConfig.average)
  expect(RealisticGeneratorConfig.max).toBeGreaterThan(RealisticGeneratorConfig.average)
  expect(RealisticGeneratorConfig.maxChange).toBeGreaterThan(0)
})

test('Generator configs have reasonable glucose ranges', () => {
  // Test all configs have min > 0 (glucose can't be negative)
  expect(StableGeneratorConfig.min).toBeGreaterThan(0)
  expect(TrendsHighGeneratorConfig.min).toBeGreaterThan(0)
  expect(RealisticGeneratorConfig.min).toBeGreaterThan(0)

  // Test all configs have max < 500 (unreasonable glucose values)
  expect(StableGeneratorConfig.max).toBeLessThan(500)
  expect(TrendsHighGeneratorConfig.max).toBeLessThan(500)
  expect(RealisticGeneratorConfig.max).toBeLessThan(500)
})
