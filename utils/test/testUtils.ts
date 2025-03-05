import type { GlucoseRecord } from '~/types/glucoseRecord'

export function getMockGlucoseRecord(created: Date, value: number = 100): GlucoseRecord {
  return {
    provider: 'test',
    x: created.getTime(),
    y: value,
    created,
    value,
  }
}
