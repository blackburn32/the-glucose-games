import { test, expect } from 'vitest'
import { getPercentToDisplay, getGlucoseValueToDisplay, getDailyStreakGameDisplayStats, getIconAndColorForScoredDay, scoredDayIsPending } from './gameDisplay'
import type { DailyStreakStats } from '~/types/dailyStreakStats'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import type { ScoredDay } from '~/types/scoredDay'
import { CurrentDayStatus } from '~/types/constants'

test('getPercentToDisplay formats percentage correctly', () => {
  expect(getPercentToDisplay('75')).toBe('75%')
  expect(getPercentToDisplay('100')).toBe('100%')
  expect(getPercentToDisplay('0')).toBe('0%')
})

test('getPercentToDisplay handles undefined input', () => {
  expect(getPercentToDisplay(undefined)).toBe('Unknown')
})

test('getGlucoseValueToDisplay formats glucose values correctly', () => {
  expect(getGlucoseValueToDisplay('120')).toBe('120 mg/dL')
  expect(getGlucoseValueToDisplay('85')).toBe('85 mg/dL')
  expect(getGlucoseValueToDisplay('0')).toBe('0 mg/dL')
})

test('getGlucoseValueToDisplay handles undefined input', () => {
  expect(getGlucoseValueToDisplay(undefined)).toBe('Unknown')
})

test('getDailyStreakGameDisplayStats returns correct stats with valid data', () => {
  const mockRecords: GlucoseRecord[] = [
    {
      value: 120,
      created: new Date(),
      x: Date.now(),
      y: 120,
      provider: 'test',
    },
  ]

  const mockStreak: DailyStreakStats = {
    currentScoredDayWithFallback: {
      date: new Date(),
      glucoseRecords: mockRecords,
      score: 75,
      scoreForDisplay: '75',
      passesThreshold: true,
    },
    bestDay: {
      date: new Date(),
      glucoseRecords: mockRecords,
      score: 90,
      scoreForDisplay: '90',
      passesThreshold: true,
    },
    bestStreak: [],
    bestStreakIncludesToday: false,
    currentStreak: {
      scoredDays: [],
      currentDayStatus: CurrentDayStatus.Pass,
    },
    scoredDays: [],
    todaysScoredDay: undefined,
    mostRecentScoredDay: undefined,
    streaks: [],
  }

  const mockScoreHandler = (score: string | undefined) => score ? `Score: ${score}` : 'No score'

  const result = getDailyStreakGameDisplayStats('Test Game', mockStreak, mockScoreHandler)

  expect(result.title).toBe('Test Game')
  expect(result.data).toBe(mockRecords)
  expect(result.description).toBe('Score: 75')
  expect(result.best).toBe('Score: 90')
})

test('getDailyStreakGameDisplayStats handles missing data', () => {
  const mockStreak: DailyStreakStats = {
    currentScoredDayWithFallback: undefined,
    bestDay: undefined,
    bestStreak: [],
    bestStreakIncludesToday: false,
    currentStreak: {
      scoredDays: [],
      currentDayStatus: CurrentDayStatus.Pending,
    },
    scoredDays: [],
    todaysScoredDay: undefined,
    mostRecentScoredDay: undefined,
    streaks: [],
  }

  const mockScoreHandler = (score: string | undefined) => score ? `Score: ${score}` : 'No score'

  const result = getDailyStreakGameDisplayStats('Test Game', mockStreak, mockScoreHandler)

  expect(result.title).toBe('Test Game')
  expect(result.data).toEqual([])
  expect(result.description).toBe('No score')
  expect(result.best).toBe('No score')
})

test('getDailyStreakGameDisplayStats uses custom score handler', () => {
  const mockStreak: DailyStreakStats = {
    currentScoredDayWithFallback: {
      date: new Date(),
      glucoseRecords: [],
      score: 75,
      scoreForDisplay: '75',
      passesThreshold: true,
    },
    bestDay: {
      date: new Date(),
      glucoseRecords: [],
      score: 90,
      scoreForDisplay: '90',
      passesThreshold: true,
    },
    bestStreak: [],
    bestStreakIncludesToday: false,
    currentStreak: {
      scoredDays: [],
      currentDayStatus: CurrentDayStatus.Pass,
    },
    scoredDays: [],
    todaysScoredDay: undefined,
    mostRecentScoredDay: undefined,
    streaks: [],
  }

  const customScoreHandler = (score: string | undefined) => score ? `Custom: ${score}!` : 'None'

  const result = getDailyStreakGameDisplayStats('Test Game', mockStreak, customScoreHandler)

  expect(result.description).toBe('Custom: 75!')
  expect(result.best).toBe('Custom: 90!')
})

test('getIconAndColorForScoredDay returns correct icon and color for undefined day', () => {
  const result = getIconAndColorForScoredDay(null as unknown as ScoredDay)
  expect(result).toEqual({
    name: 'ph:question-fill',
    color: 'text-base-content',
  })
})

test('getIconAndColorForScoredDay returns correct icon and color for pending day', () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const pendingDay = {
    date: tomorrow,
    glucoseRecords: [],
    score: 0,
    scoreForDisplay: '0',
    passesThreshold: false,
  }

  const result = getIconAndColorForScoredDay(pendingDay)
  expect(result).toEqual({
    name: 'ph:clock-fill',
    color: 'text-secondary',
  })
})

test('getIconAndColorForScoredDay returns correct icon and color for passing day', () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const passingDay = {
    date: yesterday,
    glucoseRecords: [],
    score: 100,
    scoreForDisplay: '100',
    passesThreshold: true,
  }

  const result = getIconAndColorForScoredDay(passingDay)
  expect(result).toEqual({
    name: 'ph:check-circle-fill',
    color: 'text-primary',
  })
})

test('getIconAndColorForScoredDay returns correct icon and color for failing day', () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const failingDay = {
    date: yesterday,
    glucoseRecords: [],
    score: 50,
    scoreForDisplay: '50',
    passesThreshold: false,
  }

  const result = getIconAndColorForScoredDay(failingDay)
  expect(result).toEqual({
    name: 'ph:x-circle-fill',
    color: 'text-error',
  })
})

test('scoredDayIsPending returns true for today and future dates', () => {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayScored = {
    date: today,
    glucoseRecords: [],
    score: 0,
    scoreForDisplay: '0',
    passesThreshold: false,
  }

  const tomorrowScored = {
    date: tomorrow,
    glucoseRecords: [],
    score: 0,
    scoreForDisplay: '0',
    passesThreshold: false,
  }

  expect(scoredDayIsPending(todayScored)).toBe(true)
  expect(scoredDayIsPending(tomorrowScored)).toBe(true)
})

test('scoredDayIsPending returns false for past dates', () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const yesterdayScored = {
    date: yesterday,
    glucoseRecords: [],
    score: 0,
    scoreForDisplay: '0',
    passesThreshold: false,
  }

  expect(scoredDayIsPending(yesterdayScored)).toBe(false)
})
