import type { GlucoseRecord } from '~/types/glucoseRecord'

export const groupRecordsByDay = (records: GlucoseRecord[]): { [day: string]: GlucoseRecord[] } => {
  return records.reduce((acc, record) => {
    const day = record.created.toLocaleString().split(',')[0]
    acc[day] = acc[day] || []
    acc[day].push(record)
    return acc
  }, {} as { [day: string]: GlucoseRecord[] })
}
