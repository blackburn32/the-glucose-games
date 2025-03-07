import { test, expect } from 'vitest'
import { generateTimestamps } from './timestampGenerator'

test('generateTimestamps creates correct number of records', () => {
  const values = [100, 120, 140]
  const start = new Date('2024-01-01T12:00:00Z')
  const interval = 5 * 60 * 1000 // 5 minutes in milliseconds
  
  const result = generateTimestamps(values, start, interval)
  expect(result).toHaveLength(3)
})

test('generateTimestamps creates records with correct values', () => {
  const values = [100, 120, 140]
  const start = new Date('2024-01-01T12:00:00Z')
  const interval = 5 * 60 * 1000 // 5 minutes in milliseconds
  
  const result = generateTimestamps(values, start, interval)
  expect(result[0].value).toBe(100)
  expect(result[1].value).toBe(120)
  expect(result[2].value).toBe(140)
})

test('generateTimestamps creates records with correct timestamps', () => {
  const values = [100, 120, 140]
  const start = new Date('2024-01-01T12:00:00Z')
  const interval = 5 * 60 * 1000 // 5 minutes in milliseconds
  
  const result = generateTimestamps(values, start, interval)
  
  // First record should be at start time
  expect(result[0].created.getTime()).toBe(start.getTime())
  
  // Second record should be 5 minutes before
  expect(result[1].created.getTime()).toBe(start.getTime() - interval)
  
  // Third record should be 10 minutes before
  expect(result[2].created.getTime()).toBe(start.getTime() - 2 * interval)
})

test('generateTimestamps creates records with correct x and y values', () => {
  const values = [100, 120]
  const start = new Date('2024-01-01T12:00:00Z')
  const interval = 5 * 60 * 1000 // 5 minutes in milliseconds
  
  const result = generateTimestamps(values, start, interval)
  
  expect(result[0].x).toBe(start.getTime())
  expect(result[0].y).toBe(100)
  
  expect(result[1].x).toBe(start.getTime() - interval)
  expect(result[1].y).toBe(120)
})

test('generateTimestamps handles empty array', () => {
  const values: number[] = []
  const start = new Date('2024-01-01T12:00:00Z')
  const interval = 5 * 60 * 1000
  
  const result = generateTimestamps(values, start, interval)
  expect(result).toHaveLength(0)
}) 