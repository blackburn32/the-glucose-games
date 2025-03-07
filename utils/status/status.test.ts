import { describe, it, expect } from 'vitest'
import { getIconForStatus, getColorForStatus, getIconForDailyStreak, getColorForDailyStreak } from './status'
import { CurrentDayStatus } from '~/types/constants'

describe('getIconForStatus', () => {
  it('returns correct icon for Pass status', () => {
    expect(getIconForStatus(CurrentDayStatus.Pass)).toBe('ph:check-circle')
  })

  it('returns correct icon for Fail status', () => {
    expect(getIconForStatus(CurrentDayStatus.Fail)).toBe('ph:x-circle')
  })

  it('returns correct icon for Failing status', () => {
    expect(getIconForStatus(CurrentDayStatus.Failing)).toBe('ph:minus-circle')
  })

  it('returns correct icon for Pending status', () => {
    expect(getIconForStatus(CurrentDayStatus.Pending)).toBe('ph:check-circle')
  })

  it('returns undefined for undefined status', () => {
    expect(getIconForStatus(undefined)).toBeUndefined()
  })
})

describe('getColorForStatus', () => {
  it('returns correct color for Pass status', () => {
    expect(getColorForStatus(CurrentDayStatus.Pass)).toBe('text-primary')
  })

  it('returns correct color for Fail status', () => {
    expect(getColorForStatus(CurrentDayStatus.Fail)).toBe('text-error')
  })

  it('returns correct color for Failing status', () => {
    expect(getColorForStatus(CurrentDayStatus.Failing)).toBe('text-error')
  })

  it('returns default color for Pending status', () => {
    expect(getColorForStatus(CurrentDayStatus.Pending)).toBe('text-secondary')
  })
})

describe('getIconForDailyStreak', () => {
  it('returns crown icon for streak >= 10', () => {
    expect(getIconForDailyStreak(10)).toBe('ph-crown')
    expect(getIconForDailyStreak(15)).toBe('ph-crown')
  })

  it('returns star icon for streak >= 5 and < 10', () => {
    expect(getIconForDailyStreak(5)).toBe('ph:star')
    expect(getIconForDailyStreak(9)).toBe('ph:star')
  })

  it('returns thumbs up icon for streak >= 3 and < 5', () => {
    expect(getIconForDailyStreak(3)).toBe('ph:thumbs-up')
    expect(getIconForDailyStreak(4)).toBe('ph:thumbs-up')
  })

  it('returns undefined for streak < 3', () => {
    expect(getIconForDailyStreak(0)).toBeUndefined()
    expect(getIconForDailyStreak(2)).toBeUndefined()
  })
})

describe('getColorForDailyStreak', () => {
  it('returns primary color for streak >= 10', () => {
    expect(getColorForDailyStreak(10)).toBe('text-primary')
    expect(getColorForDailyStreak(15)).toBe('text-primary')
  })

  it('returns secondary color for streak >= 5 and < 10', () => {
    expect(getColorForDailyStreak(5)).toBe('text-secondary')
    expect(getColorForDailyStreak(9)).toBe('text-secondary')
  })

  it('returns empty string for streak < 5', () => {
    expect(getColorForDailyStreak(0)).toBe('')
    expect(getColorForDailyStreak(4)).toBe('')
  })
}) 