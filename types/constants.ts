export const DEXCOM_PROVIDER_NAME = 'dexcom'
export const NIGHTSCOUT_PROVIDER_NAME = 'nightscout'

export const FIVE_MINUTES = 5 * 60 * 1000
export const ONE_DAY = 24 * 60 * 60 * 1000
export const ONE_WEEK = 7 * ONE_DAY
export const ONE_MONTH = 30 * ONE_DAY

export enum CurrentDayStatus {
  Pending,
  Pass,
  Fail,
  Failing,
}
