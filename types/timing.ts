export type Timing = {
  id: number
  icon: string
  title: string
  startHour: number
  startMinutes: number
  endHour: number
  endMinutes: number
}

export const FullDayTiming: Timing = {
  id: 0,
  icon: 'ph:calendar',
  title: 'Full Day',
  startHour: 0,
  startMinutes: 0,
  endHour: 23,
  endMinutes: 59,
}

export const NightTiming = {
  id: 1,
  icon: 'ph:moon-stars',
  title: 'Night',
  startHour: 0,
  startMinutes: 0,
  endHour: 5,
  endMinutes: 59,
}

export const MorningTiming = {
  id: 2,
  icon: 'ph:sun-horizon',
  title: 'Morning',
  startHour: 6,
  startMinutes: 0,
  endHour: 11,
  endMinutes: 59,
}

export const AfternoonTiming = {
  id: 3,
  icon: 'ph:sun',
  title: 'Afternoon',
  startHour: 12,
  startMinutes: 0,
  endHour: 17,
  endMinutes: 59,
}

export const EveningTiming = {
  id: 4,
  icon: 'ph:cloud-sun',
  title: 'Evening',
  startHour: 18,
  startMinutes: 0,
  endHour: 23,
  endMinutes: 59,
}

export const AllTimings: Timing[] = [
  FullDayTiming,
  NightTiming,
  MorningTiming,
  AfternoonTiming,
  EveningTiming,
]
