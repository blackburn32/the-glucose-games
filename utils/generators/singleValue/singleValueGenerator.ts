import type { GlucoseRecord } from '~/types/glucoseRecord'

import { toGlucoseRecord } from '~/utils/generators/utils'

/**
 * Generates glucose records for a single day with the same value.
 * @param value - The glucose value for each record.
 * @param date - The date for the records.
 * @param count - The number of records to generate. Defaults to 24 hours worth of records.
 * @param interval - The interval in minutes between each record. Defaults to 5 minutes.
 * @returns An array of glucose records.
 */
export const generateSingleValueGlucoseRecords = (value: number, date: Date, count: number = 288, interval: number = 5): GlucoseRecord[] => {
  const records: GlucoseRecord[] = []
  for (let i = 0; i < count; i++) {
    const recordDate = new Date(date.getTime() + i * interval * 60 * 1000)
    records.push(toGlucoseRecord(value, recordDate))
  }
  return records
}
