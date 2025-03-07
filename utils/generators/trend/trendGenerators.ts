import type { GlucoseGeneratorConfig } from '~/utils/generators/glucoseGenerator'

export const generateTrend = (config: GlucoseGeneratorConfig, startValue: number, endValue: number, count: number, isIncreasing: boolean) => {
    const step = (endValue - startValue) / count
    const values = []
    for (let i = 0; i < count; i++) {
      values.push(startValue + step * i)
    }
    return values.map(value => value + (isIncreasing ? 1 : -1) * Math.random() * config.maxChange)
}