import type { GlucoseRecord } from '~/types/glucoseRecord'

export function toGlucoseRecord(value: number, created: Date): GlucoseRecord {
  return {
    created,
    value,
    x: created.getTime(),
    y: value,
    provider: 'generator',
  }
}
