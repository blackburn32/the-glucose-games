import { NightTiming, MorningTiming, AfternoonTiming, EveningTiming, FullDayTiming } from './timing'

import type { DisplaySettings } from '~/types/displaySettings'
import type { Thresholds } from '~/types/thresholds'

export const NIGHTSCOUT_PROVIDER_NAME = 'nightscout'

export const THIRTY_SECONDS = 30 * 1000
export const FIVE_MINUTES = 5 * 60 * 1000
export const ONE_DAY = 24 * 60 * 60 * 1000
export const ONE_WEEK = 7 * ONE_DAY
export const ONE_MONTH = 30 * ONE_DAY
export const THREE_MONTHS = 90 * ONE_DAY
export const SIX_MONTHS = 180 * ONE_DAY
export const ONE_YEAR = 365 * ONE_DAY
export const SEVENTY_DAYS = 70 * ONE_DAY

export const MMOL_CONVERSION_FACTOR = 18.0156

export const DEFAULT_THRESHOLDS: Thresholds = {
  high: 180,
  low: 70,
  target: 110,
  dailyStreakPercentTimeInRange: 70,
}

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  useMmol: false,
}

export enum CurrentDayStatus {
  Pending,
  Pass,
  Fail,
  Failing,
}

export enum MedalType {
  Bronze,
  Silver,
  Gold,
}

export type WeeklyTimePeriod = {
  startHour: number
  startMinutes: number
  endHour: number
  endMinutes: number
  name: string
  id: number
}

export const SemanticPeriods: WeeklyTimePeriod[] = [
  { startHour: FullDayTiming.startHour, startMinutes: FullDayTiming.startMinutes, endHour: FullDayTiming.endHour, endMinutes: FullDayTiming.endMinutes, name: 'Full Day', id: FullDayTiming.id },
  { startHour: NightTiming.startHour, startMinutes: NightTiming.startMinutes, endHour: NightTiming.endHour, endMinutes: NightTiming.endMinutes, name: 'Night', id: NightTiming.id },
  { startHour: MorningTiming.startHour, startMinutes: MorningTiming.startMinutes, endHour: MorningTiming.endHour, endMinutes: MorningTiming.endMinutes, name: 'Morning', id: MorningTiming.id },
  { startHour: AfternoonTiming.startHour, startMinutes: AfternoonTiming.startMinutes, endHour: AfternoonTiming.endHour, endMinutes: AfternoonTiming.endMinutes, name: 'Afternoon', id: AfternoonTiming.id },
  { startHour: EveningTiming.startHour, startMinutes: EveningTiming.startMinutes, endHour: EveningTiming.endHour, endMinutes: EveningTiming.endMinutes, name: 'Evening', id: EveningTiming.id },
]

export const WeeklyTimePeriods: WeeklyTimePeriod[] = [
  { startHour: 0, startMinutes: 0, endHour: 4, endMinutes: 0, name: '12 AM', id: 0 },
  { startHour: 4, startMinutes: 0, endHour: 8, endMinutes: 0, name: '4 AM', id: 1 },
  { startHour: 8, startMinutes: 0, endHour: 12, endMinutes: 0, name: '8 AM', id: 2 },
  { startHour: 12, startMinutes: 0, endHour: 16, endMinutes: 0, name: '12 PM', id: 3 },
  { startHour: 16, startMinutes: 0, endHour: 20, endMinutes: 0, name: '4 PM', id: 4 },
  { startHour: 20, startMinutes: 0, endHour: 24, endMinutes: 0, name: '8 PM', id: 5 },
]

export const DaysOfWeek = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]
