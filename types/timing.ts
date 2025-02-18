export type Timing = {
  startHour: number
  startMinutes: number
  endHour: number
  endMinutes: number
}

export const FullDayTiming = {
  startHour: 0,
  startMinutes: 0,
  endHour: 23,
  endMinutes: 59,
}

export const NightTiming = {
  startHour: 0,
  startMinutes: 0,
  endHour: 5,
  endMinutes: 59,
}

export const MorningTiming = {
  startHour: 6,
  startMinutes: 0,
  endHour: 11,
  endMinutes: 59,
}

export const AfternoonTiming = {
  startHour: 12,
  startMinutes: 0,
  endHour: 17,
  endMinutes: 59,
}

export const EveningTiming = {
  startHour: 18,
  startMinutes: 0,
  endHour: 23,
  endMinutes: 59,
}
