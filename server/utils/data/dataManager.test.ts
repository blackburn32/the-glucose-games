import { test, expect, describe, vi, beforeEach, afterEach } from 'vitest'
import { MockSupabaseClient } from '../test/mockSupabase'
import { getNightscoutSettings } from '../database/nightscoutSettings/getNightscoutSettings/getNightscoutSettings'
import { pageThroughNightscoutEGVs } from '../nightscout/nightscoutTools'
import { DataManager } from './dataManager'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getMockGlucoseRecord } from '~/utils/test/testUtils'

// Mock the dependencies
vi.mock('../database/nightscoutSettings/getNightscoutSettings/getNightscoutSettings', () => ({
  getNightscoutSettings: vi.fn(),
}))

vi.mock('../nightscout/nightscoutTools', () => ({
  pageThroughNightscoutEGVs: vi.fn(),
}))

vi.mock('../database/oauthTokens/getToken/getToken', () => ({
  getToken: vi.fn(),
}))

describe('DataManager', () => {
  const userId = 'test-user-id'
  const mockSupabase = new MockSupabaseClient()
  let dataManager: DataManager

  // Mock console.trace to prevent logs during tests
  const originalConsoleTrace = console.trace

  beforeEach(() => {
    vi.resetAllMocks()
    mockSupabase.resetMocks()
    dataManager = new DataManager(
      userId,
      mockSupabase.getMockClient(),
    )
    console.trace = vi.fn()
  })

  afterEach(() => {
    console.trace = originalConsoleTrace
  })

  describe('getNightscoutData', () => {
    test('should fetch and return Nightscout data when settings exist', async () => {
      // Arrange
      const mockNightscoutSettings = {
        base_url: 'https://nightscout-test.herokuapp.com',
        token: 'test-token',
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const mockGlucoseRecords = [
        getMockGlucoseRecord(new Date(), 120),
        getMockGlucoseRecord(new Date(Date.now() - 5000), 130),
      ] as unknown as GlucoseRecord[]

      vi.mocked(getNightscoutSettings).mockResolvedValueOnce(mockNightscoutSettings)
      vi.mocked(pageThroughNightscoutEGVs).mockResolvedValueOnce(mockGlucoseRecords)

      // Act
      const result = await dataManager.getNightscoutData()

      // Assert
      expect(getNightscoutSettings).toHaveBeenCalledWith(userId, mockSupabase.getMockClient())
      expect(pageThroughNightscoutEGVs).toHaveBeenCalledWith(
        mockNightscoutSettings.base_url,
        mockNightscoutSettings.token,
        1000,
        expect.any(Date),
        expect.any(Date),
      )
      expect(result).toEqual(mockGlucoseRecords)
    })

    test('should return empty array when Nightscout settings do not exist', async () => {
      // Arrange
      vi.mocked(getNightscoutSettings).mockResolvedValueOnce(null)

      // Act
      const result = await dataManager.getNightscoutData()

      // Assert
      expect(getNightscoutSettings).toHaveBeenCalledWith(userId, mockSupabase.getMockClient())
      expect(pageThroughNightscoutEGVs).not.toHaveBeenCalled()
      expect(console.trace).toHaveBeenCalledWith('No Nightscout settings found')
      expect(result).toEqual([])
    })
  })
})
