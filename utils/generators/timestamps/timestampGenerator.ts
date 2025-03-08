import type { GlucoseRecord } from '~/types/glucoseRecord'
import { toGlucoseRecord } from '~/utils/generators/utils'

export const generateTimestamps = (glucoseValues: number[], start: Date, interval: number): GlucoseRecord[] => {
  const timestamps: GlucoseRecord[] = []
  for (let i = 0; i < glucoseValues.length; i++) {
    const createdDate = new Date(start.getTime() - i * interval)
    timestamps.push(toGlucoseRecord(glucoseValues[i], createdDate))
  }
  return timestamps
}
