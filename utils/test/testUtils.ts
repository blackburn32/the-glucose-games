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

export const createDate = (hours: number, minutes: number = 0, startDate: Date = new Date('2023-10-10')) => {
  startDate.setHours(hours, minutes)
  return startDate
}

export const getDayBefore = (date: Date) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() - 1)
  return newDate
}
