import type { GlucoseRecord } from '~/types/glucoseRecord'

export const getLastNight = (records: GlucoseRecord[]) => {
  const now = new Date()
  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)
  const todayMorning = new Date()
  todayMorning.setHours(6, 0, 0, 0)

  const [start, end] = now < todayMorning
    ? [new Date(todayMidnight).setDate(new Date(todayMidnight).getDate() - 1), new Date(todayMorning).setDate(new Date(todayMorning).getDate() - 1)]
    : [todayMidnight, todayMorning]

  return records.filter(record => record.created > start && record.created < end)
}
