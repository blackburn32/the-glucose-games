import { CurrentDayStatus } from '~/types/constants'

export const getIconForStatus = (status?: CurrentDayStatus | undefined) => {
  switch (status) {
    case CurrentDayStatus.Pass:
      return 'ph:check-circle'
    case CurrentDayStatus.Fail:
      return 'ph:x-circle'
    case CurrentDayStatus.Failing:
      return 'ph:minus-circle'
    case CurrentDayStatus.Pending:
      return 'ph:check-circle'
    case undefined:
      return undefined
    default:
      return undefined
  }
}

export const getColorForStatus = (status: CurrentDayStatus) => {
  switch (status) {
    case CurrentDayStatus.Pass:
      return 'text-primary'
    case CurrentDayStatus.Fail:
      return 'text-error'
    case CurrentDayStatus.Failing:
      return 'text-error'
    default:
      return 'text-secondary'
  }
}

export const getIconForDailyStreak = (streakLength: number) => {
  if (streakLength >= 10) {
    return 'ph-crown'
  }
  if (streakLength >= 5) {
    return 'ph:star'
  }
  if (streakLength >= 3) {
    return 'ph:thumbs-up'
  }
  return undefined
}

export const getColorForDailyStreak = (streakLength: number) => {
  if (streakLength >= 10) {
    return 'text-primary'
  }
  if (streakLength >= 5) {
    return 'text-secondary'
  }
  return ''
}
