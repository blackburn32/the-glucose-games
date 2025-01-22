import type { GlucoseRecord } from '~/types/types.ts'

export type GlucoseGeneratorConfig = {
  average: number
  min: number
  max: number
  maxChange: number
}

export const StableGeneratorConfig: GlucoseGeneratorConfig = {
  average: 100,
  min: 80,
  max: 150,
  maxChange: 5,
}

export const TrendsHighGeneratorConfig: GlucoseGeneratorConfig = {
  average: 150,
  min: 120,
  max: 250,
  maxChange: 8,
}

export const RealisticGeneratorConfig: GlucoseGeneratorConfig = {
  average: 130,
  min: 55,
  max: 350,
  maxChange: 8,
}

const generateStableToHigh = (config: GlucoseGeneratorConfig, previousValue: number) => {
  const newValue = Math.round(previousValue + Math.random() * config.maxChange)
  return Math.min(newValue, config.max)
}

const generateStableToLow = (config: GlucoseGeneratorConfig, previousValue: number) => {
  const newValue = Math.round(previousValue - Math.random() * config.maxChange)
  return Math.max(newValue, config.min)
}

const generateTrend = (config: GlucoseGeneratorConfig, startValue: number, endValue: number, count: number, isIncreasing: boolean) => {
  const step = (endValue - startValue) / count
  const values = []
  for (let i = 0; i < count; i++) {
    values.push(startValue + step * i)
  }
  return values.map(value => value + (isIncreasing ? 1 : -1) * Math.random() * config.maxChange)
}

export const generateGlucoseValues = (config: GlucoseGeneratorConfig, count: number) => {
  const values = []
  let previousValue = config.average
  let trend = Math.random() > 0.5
  for (let i = 0; i < count; i++) {
    if (previousValue > config.max * 0.9 || previousValue < config.min * 1.1) {
      trend = previousValue < config.min * 1.1
    }
    else if (Math.random() > 0.8) {
      trend = !trend
    }
    const newValue = trend ? generateStableToHigh(config, previousValue) : generateStableToLow(config, previousValue)
    values.push(newValue)
    previousValue = newValue
  }
  return generateTimestamps(values, new Date(), 5 * 60 * 1000).reverse()
}

const toGlucoseRecord: GlucoseRecord = (value: number, created: Date) => {
  return {
    value,
    created,
    x: created.getTime(),
    y: value,
    provider: 'generator',
  }
}

const generateTimestamps = (glucoseValues: number[], start: Date, interval: number) => {
  const timestamps: GlucoseRecord[] = []
  for (let i = 0; i < glucoseValues.length; i++) {
    const createdDate = new Date(start.getTime() - i * interval)
    timestamps.push(toGlucoseRecord(glucoseValues[i], createdDate))
  }
  return timestamps
}
