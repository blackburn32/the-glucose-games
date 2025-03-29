import { type GlucoseGeneratorConfig, RealisticGeneratorConfig } from '~/utils/generators/config/generatorConfig'
import { generateTimestamps } from '~/utils/generators/timestamps/timestampGenerator'

export const generateSinusoidalPattern = (config: GlucoseGeneratorConfig = RealisticGeneratorConfig, count: number = 1000, minutesBetweenRecords: number = 30, numberOfSinusoids: number = 1, startingOffset: number = 0) => {
  const values = []
  const amplitude = (config.max - config.min) / 2
  const offset = config.average
  const frequency = (2 * Math.PI) / count * numberOfSinusoids

  for (let i = 0; i < count; i++) {
    const value = offset + amplitude * Math.sin(frequency * i + startingOffset)
    values.push(Math.max(config.min, Math.min(config.max, value)))
  }

  return generateTimestamps(values, new Date(), minutesBetweenRecords * 60 * 1000).reverse()
}
