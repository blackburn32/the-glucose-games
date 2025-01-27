import type { GlucoseRecord } from '~/types/glucoseRecord'

export const isTimeInRange = (timeToCheck: Date, startHour: number, startMinutes: number, endHour: number, endMinutes: number) => {
  const hour = timeToCheck.getHours()
  const minutes = timeToCheck.getMinutes()
  const startIsValid = hour > startHour || (hour === startHour && minutes >= startMinutes)
  const endIsValid = hour < endHour || (hour === endHour && minutes <= endMinutes)
  return startIsValid && endIsValid
}

export const filterRecordsByTimePeriod = (
  records: GlucoseRecord[],
  startHour: number,
  startMinutes: number,
  endHour: number,
  endMinutes: number,

) => {
  return records.filter((record) => {
    return isTimeInRange(record.created, startHour, startMinutes, endHour, endMinutes)
  })
}
