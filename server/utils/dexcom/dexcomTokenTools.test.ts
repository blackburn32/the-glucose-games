import { test, expect, describe, vi, beforeEach } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  requestDexcomToken,
  refreshDexcomTokenIfNecessary,
  dexcomRecordToGlucoseRecord,
  getEstimatedBloodGlucoseValuesFromDexcom,
} from './dexcomTokenTools'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'
import type { Database } from '~/types/database.types'

// Mock the createError function since it's from Nuxt
vi.mock('#imports', () => ({
  createError: (params: { statusCode: number, statusMessage: string }) => {
    throw new Error(`${params.statusCode}: ${params.statusMessage}`)
  },
}))

describe('dexcomTokenTools', () => {
  const mockUserId = 'test-user-id'
  const mockBaseUrl = 'https://api.dexcom.com'
  const mockClientId = 'test-client-id'
  const mockClientSecret = 'test-client-secret'
  const mockRedirectUrl = 'http://localhost:3000/callback'
  const mockCode = 'test-auth-code'

  const mockValidTokenResponse = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    token_type: 'Bearer',
  }

  // Create a minimal mock of SupabaseClient with just the methods we need
  const mockClient = {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    }),
  } as unknown as SupabaseClient<Database>

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    // Reset the mock implementation for each test
    vi.mocked(mockClient.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    })
  })

  describe('requestDexcomToken', () => {
    test('should successfully request and store token', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockValidTokenResponse),
      } as Response)

      const result = await requestDexcomToken(
        mockUserId,
        mockCode,
        mockBaseUrl,
        mockClientId,
        mockClientSecret,
        mockRedirectUrl,
        mockClient,
      )

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/v2/oauth2/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: expect.any(String),
        },
      )

      expect(result).toEqual({
        access_token: mockValidTokenResponse.access_token,
        refresh_token: mockValidTokenResponse.refresh_token,
        expires_at: expect.any(String),
        created_at: expect.any(String),
        user_id: mockUserId,
        scopes: ['offline_access'],
        provider: DEXCOM_PROVIDER_NAME,
      })
    })

    test('should throw error for invalid token response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: () => Promise.resolve({ invalid: 'response' }),
      } as Response)

      await expect(
        requestDexcomToken(
          mockUserId,
          mockCode,
          mockBaseUrl,
          mockClientId,
          mockClientSecret,
          mockRedirectUrl,
          mockClient,
        ),
      ).rejects.toThrow('Failed to validate authorization response')
    })
  })

  describe('refreshDexcomTokenIfNecessary', () => {
    test('should not refresh unexpired token', async () => {
      const mockToken = {
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        refresh_token: 'test-refresh-token',
      } as Database['public']['Tables']['oauth_tokens']['Row']

      const result = await refreshDexcomTokenIfNecessary(
        mockUserId,
        mockToken,
        mockClient,
        mockBaseUrl,
        mockClientId,
        mockClientSecret,
      )

      expect(fetch).not.toHaveBeenCalled()
      expect(result).toEqual(mockToken)
    })

    test('should refresh expired token', async () => {
      const mockExpiredToken = {
        expires_at: new Date(Date.now() - 3600000).toISOString(),
        refresh_token: 'test-refresh-token',
      } as Database['public']['Tables']['oauth_tokens']['Row']

      vi.mocked(fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockValidTokenResponse),
      } as Response)

      const result = await refreshDexcomTokenIfNecessary(
        mockUserId,
        mockExpiredToken,
        mockClient,
        mockBaseUrl,
        mockClientId,
        mockClientSecret,
      )

      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/v2/oauth2/token`,
        expect.any(Object),
      )
      expect(result).toEqual({
        access_token: mockValidTokenResponse.access_token,
        refresh_token: mockValidTokenResponse.refresh_token,
        expires_at: expect.any(String),
        created_at: expect.any(String),
        user_id: mockUserId,
        scopes: ['offline_access'],
        provider: DEXCOM_PROVIDER_NAME,
      })
    })
  })

  describe('dexcomRecordToGlucoseRecord', () => {
    test('should convert Dexcom record to glucose record', () => {
      const mockDexcomRecord = {
        recordId: 'test-record-id',
        systemTime: '2024-01-01T12:00:00',
        displayTime: '2024-01-01T12:00:00',
        value: 120,
        trend: 'Flat',
        trendRate: 0,
        unit: 'mg/dL',
        rateUnit: 'mg/dL/min',
        displayDevice: 'test-device',
        transmitterGeneration: 'test-gen',
      }

      const result = dexcomRecordToGlucoseRecord(mockDexcomRecord)

      expect(result).toEqual({
        created: new Date(mockDexcomRecord.displayTime),
        x: new Date(mockDexcomRecord.displayTime).getTime(),
        y: mockDexcomRecord.value,
        value: mockDexcomRecord.value,
        provider: DEXCOM_PROVIDER_NAME,
        trend: mockDexcomRecord.trend,
        trendRate: mockDexcomRecord.trendRate,
        unit: mockDexcomRecord.unit,
        rateUnit: mockDexcomRecord.rateUnit,
      })
    })
  })

  describe('getEstimatedBloodGlucoseValuesFromDexcom', () => {
    const mockToken = {
      access_token: 'test-access-token',
    } as Database['public']['Tables']['oauth_tokens']['Row']

    const mockValidEGVResponse = {
      recordType: 'EGV',
      recordVersion: '1.0',
      userId: 'test-user',
      records: [{
        recordId: 'test-record-id',
        systemTime: '2024-01-01T12:00:00',
        displayTime: '2024-01-01T12:00:00',
        value: 120,
        trend: 'Flat',
        trendRate: 0,
        unit: 'mg/dL',
        rateUnit: 'mg/dL/min',
        displayDevice: 'test-device',
        transmitterGeneration: 'test-gen',
      }],
    }

    test('should fetch and convert EGV values successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(mockValidEGVResponse),
      } as Response)

      const since = new Date('2024-01-01T00:00:00')
      const until = new Date('2024-01-01T23:59:59')

      const result = await getEstimatedBloodGlucoseValuesFromDexcom(
        since,
        until,
        mockToken,
        mockBaseUrl,
      )

      // Don't test the exact URL since the date formatting might be environment-dependent
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${mockBaseUrl}/v3/users/self/egvs?startDate=`),
        {
          headers: {
            Authorization: `Bearer ${mockToken.access_token}`,
          },
        },
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        created: new Date(mockValidEGVResponse.records[0].displayTime),
        x: new Date(mockValidEGVResponse.records[0].displayTime).getTime(),
        y: mockValidEGVResponse.records[0].value,
        value: mockValidEGVResponse.records[0].value,
        provider: DEXCOM_PROVIDER_NAME,
        trend: mockValidEGVResponse.records[0].trend,
        trendRate: mockValidEGVResponse.records[0].trendRate,
        unit: mockValidEGVResponse.records[0].unit,
        rateUnit: mockValidEGVResponse.records[0].rateUnit,
      })
    })

    test('should return empty array for unauthorized request', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      } as Response)

      const since = new Date('2024-01-01T00:00:00')
      const until = new Date('2024-01-01T23:59:59')

      const result = await getEstimatedBloodGlucoseValuesFromDexcom(
        since,
        until,
        mockToken,
        mockBaseUrl,
      )

      expect(result).toEqual([])
    })

    test('should throw error for invalid EGV response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ invalid: 'response' }),
      } as Response)

      const since = new Date('2024-01-01T00:00:00')
      const until = new Date('2024-01-01T23:59:59')

      await expect(
        getEstimatedBloodGlucoseValuesFromDexcom(
          since,
          until,
          mockToken,
          mockBaseUrl,
        ),
      ).rejects.toThrow('Failed to validate Dexcom EGV response')
    })
  })
})
