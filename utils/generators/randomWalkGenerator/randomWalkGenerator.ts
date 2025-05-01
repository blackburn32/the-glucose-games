import { type GlucoseGeneratorConfig, RealisticGeneratorConfig } from '~/utils/generators/config/generatorConfig'
import { generateTimestamps } from '~/utils/generators/timestamps/timestampGenerator'

const generateStableToHigh = (config: GlucoseGeneratorConfig, previousValue: number) => {
  const newValue = Math.round(previousValue + Math.random() * config.maxChange)
  return Math.min(newValue, config.max)
}

const generateStableToLow = (config: GlucoseGeneratorConfig, previousValue: number) => {
  const newValue = Math.round(previousValue - Math.random() * config.maxChange)
  return Math.max(newValue, config.min)
}

export const generateRandomWalk = (config: GlucoseGeneratorConfig = RealisticGeneratorConfig, count: number = 4500, minutesBetweenRecords: number = 30) => {
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
  return generateTimestamps(values, new Date(), minutesBetweenRecords * 60 * 1000).reverse()
}
