import { describe, it, expect } from 'vitest'
import { cleanPercentForDisplay } from './percentFormatting'

describe('cleanPercentForDisplay', () => {
  it('should format non-zero numbers to 2 decimal places', () => {
    expect(cleanPercentForDisplay(75.4567)).toBe('75.46')
    expect(cleanPercentForDisplay(100)).toBe('100.00')
    expect(cleanPercentForDisplay(33.3333)).toBe('33.33')
  })

  it('should handle zero', () => {
    expect(cleanPercentForDisplay(0)).toBe('0.00')
  })

  it('should handle falsy values', () => {
    expect(cleanPercentForDisplay(null as unknown as number)).toBe('0.00')
    expect(cleanPercentForDisplay(undefined as unknown as number)).toBe('0.00')
  })
}) 