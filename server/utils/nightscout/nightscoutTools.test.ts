import { test, expect, describe, vi, beforeEach } from 'vitest'
import { nightScoutRecordToGlucoseRecord, getNightscoutEGVs } from './nightscoutTools'
import { NIGHTSCOUT_PROVIDER_NAME } from '~/types/constants'

// Create a mock fetch response
const createFetchResponse = (data: unknown): Response => {
  const response = new Response(JSON.stringify(data))
  vi.spyOn(response, 'json').mockImplementation(() => Promise.resolve(data))
  return response
}

// Create a mock error response
const createErrorResponse = (): Response => {
  const response = new Response('', { status: 500, statusText: 'Internal Server Error' })
  vi.spyOn(response, 'json').mockImplementation(() => Promise.reject(new Error('JSON parse error')))
  return response
}

describe('nightscoutTools', () => {
  describe('nightScoutRecordToGlucoseRecord', () => {
    test('should convert nightscout record to glucose record', () => {
      const mockDate = new Date('2024-01-01T12:00:00Z')
      const nightscoutRecord = {
        date: mockDate.getTime(),
        sgv: 120,
        type: 'sgv',
      }

      const result = nightScoutRecordToGlucoseRecord(nightscoutRecord)

      expect(result).toEqual({
        created: mockDate,
        x: mockDate.getTime(),
        y: 120,
        value: 120,
        provider: NIGHTSCOUT_PROVIDER_NAME,
        unit: 'sgv',
      })
    })
  })

  describe('getNightscoutEGVs', () => {
    const mockBaseUrl = 'https://example.com'
    const mockToken = 'test-token'
    const mockCount = 10
    const mockValidResponse = [
      { date: Date.now(), sgv: 120, type: 'sgv' },
      { date: Date.now() - 5000, sgv: 115, type: 'sgv' },
    ]

    beforeEach(() => {
      // Reset all mocks before each test
      vi.resetAllMocks()
      // Mock the global fetch function
      vi.stubGlobal('fetch', vi.fn())
    })

    test('should fetch and convert valid nightscout records', async () => {
      // Mock successful fetch with valid data
      vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(mockValidResponse))

      const result = await getNightscoutEGVs(mockBaseUrl, mockToken, mockCount)

      // Verify fetch was called with correct URL and options
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/v1/entries/sgv?token=${mockToken}&count=${mockCount}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        },
      )

      // Verify records were converted correctly
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        created: expect.any(Date),
        x: mockValidResponse[0].date,
        y: mockValidResponse[0].sgv,
        value: mockValidResponse[0].sgv,
        provider: NIGHTSCOUT_PROVIDER_NAME,
        unit: mockValidResponse[0].type,
      })
    })

    test('should handle invalid response data', async () => {
      const mockInvalidResponse = [
        { invalidField: 'invalid data' },
      ]

      // Mock fetch with invalid data
      vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(mockInvalidResponse))

      const result = await getNightscoutEGVs(mockBaseUrl, mockToken, mockCount)

      // Should return empty array for invalid data
      expect(result).toEqual([])
    })

    test('should handle fetch errors', async () => {
      // Mock fetch error
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      // Should throw the fetch error
      await expect(getNightscoutEGVs(mockBaseUrl, mockToken, mockCount))
        .rejects.toThrow('Network error')
    })

    test('should handle JSON parse errors', async () => {
      // Mock JSON parse error
      vi.mocked(fetch).mockResolvedValueOnce(createErrorResponse())

      // Should throw the JSON parse error
      await expect(getNightscoutEGVs(mockBaseUrl, mockToken, mockCount))
        .rejects.toThrow('JSON parse error')
    })
  })
})
