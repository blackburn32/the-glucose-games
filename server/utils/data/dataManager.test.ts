import { test, expect, describe, vi, beforeEach, afterEach } from 'vitest'
import type { RuntimeConfig } from 'nuxt/schema'
import { MockSupabaseClient } from '../test/mockSupabase'
import { getNightscoutSettings } from '../database/nightscoutSettings/getNightscoutSettings/getNightscoutSettings'
import { getNightscoutEGVs } from '../nightscout/nightscoutTools'
import { refreshDexcomTokenIfNecessary, getEstimatedBloodGlucoseValuesFromDexcom } from '../dexcom/dexcomTokenTools'
import { getToken } from '../database/oauthTokens/getToken/getToken'
import { DataManager } from './dataManager'
import type { Database } from '~/types/database.types'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getMockGlucoseRecord } from '~/utils/test/testUtils'

// Mock the dependencies
vi.mock('../database/nightscoutSettings/getNightscoutSettings/getNightscoutSettings', () => ({
  getNightscoutSettings: vi.fn(),
}))

vi.mock('../nightscout/nightscoutTools', () => ({
  getNightscoutEGVs: vi.fn(),
}))

vi.mock('../dexcom/dexcomTokenTools', () => ({
  refreshDexcomTokenIfNecessary: vi.fn(),
  getEstimatedBloodGlucoseValuesFromDexcom: vi.fn(),
}))

vi.mock('../database/oauthTokens/getToken/getToken', () => ({
  getToken: vi.fn(),
}))

describe('DataManager', () => {
  const userId = 'test-user-id'
  const mockSupabase = new MockSupabaseClient()
  // Cast mockRuntimeConfig as RuntimeConfig for type safety
  const mockRuntimeConfig: RuntimeConfig = {
    dexcomBaseUrl: 'https://api.dexcom.com',
    dexcomClientId: 'test-client-id',
    dexcomClientSecret: 'test-client-secret',
    public: {},
    app: {},
  } as unknown as RuntimeConfig

  let dataManager: DataManager

  // Mock console.trace to prevent logs during tests
  const originalConsoleTrace = console.trace

  beforeEach(() => {
    vi.resetAllMocks()
    mockSupabase.resetMocks()
    dataManager = new DataManager(
      userId,
      mockSupabase.getMockClient(),
      mockRuntimeConfig,
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
      vi.mocked(getNightscoutEGVs).mockResolvedValueOnce(mockGlucoseRecords)

      // Act
      const result = await dataManager.getNightscoutData()

      // Assert
      expect(getNightscoutSettings).toHaveBeenCalledWith(userId, mockSupabase.getMockClient())
      expect(getNightscoutEGVs).toHaveBeenCalledWith(
        mockNightscoutSettings.base_url,
        mockNightscoutSettings.token,
        100000,
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
      expect(getNightscoutEGVs).not.toHaveBeenCalled()
      expect(console.trace).toHaveBeenCalledWith('No Nightscout settings found')
      expect(result).toEqual([])
    })
  })

  describe('getDexcomData', () => {
    test('should fetch and return Dexcom data when token exists', async () => {
      // Arrange
      const mockToken: Database['public']['Tables']['oauth_tokens']['Row'] = {
        id: 'test-id',
        user_id: userId,
        provider: DEXCOM_PROVIDER_NAME,
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        scopes: ['test-scope'],
      }

      const mockGlucoseRecords = [
        getMockGlucoseRecord(new Date(), 120),
        getMockGlucoseRecord(new Date(Date.now() - 5000), 130),
      ]

      vi.mocked(getToken).mockResolvedValueOnce(mockToken)
      vi.mocked(refreshDexcomTokenIfNecessary).mockResolvedValueOnce(mockToken)
      vi.mocked(getEstimatedBloodGlucoseValuesFromDexcom).mockResolvedValueOnce(mockGlucoseRecords)

      // Act
      const result = await dataManager.getDexcomData()

      // Assert
      expect(getToken).toHaveBeenCalledWith(userId, DEXCOM_PROVIDER_NAME, mockSupabase.getMockClient())
      expect(refreshDexcomTokenIfNecessary).toHaveBeenCalledWith(
        userId,
        mockToken,
        mockSupabase.getMockClient(),
        mockRuntimeConfig.dexcomBaseUrl,
        mockRuntimeConfig.dexcomClientId,
        mockRuntimeConfig.dexcomClientSecret,
      )

      // Since dates are created during the test, we can't check exact equality
      // Instead, check that getEstimatedBloodGlucoseValuesFromDexcom was called with dates
      // that are approximately a month apart
      const getEBGVFromDexcomCall = vi.mocked(getEstimatedBloodGlucoseValuesFromDexcom).mock.calls[0]
      const startDate = getEBGVFromDexcomCall[0] as Date
      const endDate = getEBGVFromDexcomCall[1] as Date

      // The date difference should be approximately 28 days (give or take a few milliseconds for execution time)
      const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
      expect(daysDiff).toBe(28)

      expect(getEstimatedBloodGlucoseValuesFromDexcom).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date),
        mockToken,
        mockRuntimeConfig.dexcomBaseUrl,
      )
      expect(result).toEqual(mockGlucoseRecords)
    })

    test('should return empty array when Dexcom token does not exist', async () => {
      // Arrange
      vi.mocked(getToken).mockResolvedValueOnce(null)

      // Act
      const result = await dataManager.getDexcomData()

      // Assert
      expect(getToken).toHaveBeenCalledWith(userId, DEXCOM_PROVIDER_NAME, mockSupabase.getMockClient())
      expect(refreshDexcomTokenIfNecessary).not.toHaveBeenCalled()
      expect(getEstimatedBloodGlucoseValuesFromDexcom).not.toHaveBeenCalled()
      expect(console.trace).toHaveBeenCalledWith('No token found for Dexcom')
      expect(result).toEqual([])
    })
  })
})
