import type { GlucoseRecord } from '~/types/glucoseRecord'

/**
 * Returns the glucose values which were recorded between midnight and 6AM, inclusive of start, exclusive of end.
 *
 * If the current time is before 1AM, it will return the values from the previous night.
 * @param {GlucoseRecord[]} records
 * @param {Date} startTime
 * @returns {GlucoseRecord[]}
 */
export const getLastNight = (records: GlucoseRecord[], startTime: Date = new Date()) => {
  const dateToUse = new Date(startTime)
  const isAfter1AM = startTime.getHours() >= 1
  if (!isAfter1AM) {
    dateToUse.setDate(dateToUse.getDate() - 1)
  }
  const recordsOnDate = getRecordsWithSameDate(records, dateToUse)
  return recordsOnDate.filter(record => record.created.getHours() < 6)
}

export function getRecordsWithSameDate(records: GlucoseRecord[], date: Date): GlucoseRecord[] {
  return records.filter(record => record.created.toDateString() === date.toDateString())
}
