import type { Thresholds } from '~/types/thresholds'
import type { DisplaySettings } from '~/types/displaySettings'

export const DEXCOM_PROVIDER_NAME = 'dexcom'
export const NIGHTSCOUT_PROVIDER_NAME = 'nightscout'

export const FIVE_MINUTES = 5 * 60 * 1000
export const ONE_DAY = 24 * 60 * 60 * 1000
export const ONE_WEEK = 7 * ONE_DAY
export const ONE_MONTH = 30 * ONE_DAY
export const THREE_MONTHS = 100 * ONE_DAY
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
