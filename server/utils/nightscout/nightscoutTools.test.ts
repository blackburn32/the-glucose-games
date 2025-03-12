import { test, expect, describe, vi, beforeEach, afterEach } from 'vitest'
import { nightScoutRecordToGlucoseRecord, getNightscoutEGVs, pageThroughNightscoutEGVs } from './nightscoutTools'
import { NIGHTSCOUT_PROVIDER_NAME } from '~/types/constants'
import { getTimestampsBetweenDatesUsingDuration } from '~/utils/timing/timeSlicers'

// Mock the timing utils
vi.mock('~/utils/timing/timeSlicers', () => ({
  getTimestampsBetweenDatesUsingDuration: vi.fn(),
}))

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

      const mockTimestamp = 1234567890000
      const mockNextTimestamp = 1234567890000 + 1000 * 60 * 60 * 24 // 1 day later

      const result = await getNightscoutEGVs(mockBaseUrl, mockToken, mockCount, mockTimestamp, mockNextTimestamp)

      // Verify fetch was called with correct URL and options
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/v1/entries/sgv?token=${mockToken}&count=${mockCount}&find[date][$gte]=${mockTimestamp}&find[date][$lt]=${mockNextTimestamp}`,
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

      const mockTimestamp = 1234567890000
      const mockNextTimestamp = 1234567890000 + 1000 * 60 * 60 * 24 // 1 day later

      const result = await getNightscoutEGVs(mockBaseUrl, mockToken, mockCount, mockTimestamp, mockNextTimestamp)

      // Should return empty array for invalid data
      expect(result).toEqual([])
    })

    test('should handle fetch errors', async () => {
      // Mock fetch error
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      const mockTimestamp = 1234567890000
      const mockNextTimestamp = 1234567890000 + 1000 * 60 * 60 * 24 // 1 day later

      const result = await getNightscoutEGVs(mockBaseUrl, mockToken, mockCount, mockTimestamp, mockNextTimestamp)

      // Should return empty array for fetch errors
      expect(result).toEqual([])
    })

    test('should handle JSON parse errors', async () => {
      // Mock fetch with response that will fail to parse
      vi.mocked(fetch).mockResolvedValueOnce(createErrorResponse())

      const mockTimestamp = 1234567890000
      const mockNextTimestamp = 1234567890000 + 1000 * 60 * 60 * 24 // 1 day later

      const result = await getNightscoutEGVs(mockBaseUrl, mockToken, mockCount, mockTimestamp, mockNextTimestamp)

      // Should return empty array for JSON parse errors
      expect(result).toEqual([])
    })

    test('should use current time when nextTimestamp is undefined', async () => {
      // Mock successful fetch with valid data
      vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(mockValidResponse))

      const mockTimestamp = 1234567890000
      const mockNow = new Date('2024-01-01T12:00:00Z')
      // Use fake timers to control current time
      vi.useFakeTimers()
      vi.setSystemTime(mockNow)

      const result = await getNightscoutEGVs(mockBaseUrl, mockToken, mockCount, mockTimestamp)

      // Verify fetch was called with current time as nextTimestamp
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/api/v1/entries/sgv?token=${mockToken}&count=${mockCount}&find[date][$gte]=${mockTimestamp}&find[date][$lt]=${mockNow.getTime()}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        },
      )

      // Cleanup
      vi.useRealTimers()

      // Verify records were converted correctly
      expect(result).toHaveLength(2)
    })
  })

  describe('pageThroughNightscoutEGVs', () => {
    const mockBaseUrl = 'https://example.com'
    const mockToken = 'test-token'
    const mockCountPerRequest = 10
    const mockSince = new Date('2024-01-01')
    const mockNow = new Date('2024-01-10')

    beforeEach(() => {
      vi.resetAllMocks()
      vi.stubGlobal('fetch', vi.fn())
      // Mock Date.now to return a consistent value
      vi.useFakeTimers()
      vi.setSystemTime(mockNow)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    test('should fetch data for multiple time periods and combine results', async () => {
      // Mock timestamps for three 3-day periods
      const mockTimestamps = [
        new Date('2024-01-01').getTime(),
        new Date('2024-01-04').getTime(),
        new Date('2024-01-07').getTime(),
        new Date('2024-01-10').getTime(),
      ]

      vi.mocked(getTimestampsBetweenDatesUsingDuration).mockReturnValue(mockTimestamps)

      // Mock responses for each period
      const mockResponses = [
        [{ date: mockTimestamps[0], sgv: 120, type: 'sgv' }],
        [{ date: mockTimestamps[1], sgv: 130, type: 'sgv' }],
        [{ date: mockTimestamps[2], sgv: 140, type: 'sgv' }],
      ]

      // Setup fetch to return different responses for each call
      mockResponses.forEach((response) => {
        vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(response))
      })

      const result = await pageThroughNightscoutEGVs(mockBaseUrl, mockToken, mockCountPerRequest, mockSince)

      // Verify getTimestampsBetweenDatesUsingDuration was called correctly
      expect(getTimestampsBetweenDatesUsingDuration).toHaveBeenCalledWith(
        mockSince,
        expect.any(Date),
        1000 * 60 * 60 * 24 * 3, // 3 days in milliseconds
      )

      // Verify fetch was called for each time period
      expect(fetch).toHaveBeenCalledTimes(3)

      // Verify the URLs for each fetch call
      for (let i = 0; i < 3; i++) {
        expect(fetch).toHaveBeenNthCalledWith(
          i + 1,
          `${mockBaseUrl}/api/v1/entries/sgv?token=${mockToken}&count=${mockCountPerRequest}&find[date][$gte]=${mockTimestamps[i]}&find[date][$lt]=${mockTimestamps[i + 1]}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
            },
          },
        )
      }

      // Verify results were combined correctly
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({
        created: new Date(mockTimestamps[0]),
        x: mockTimestamps[0],
        y: 120,
        value: 120,
        provider: NIGHTSCOUT_PROVIDER_NAME,
        unit: 'sgv',
      })
      expect(result[1].value).toBe(130)
      expect(result[2].value).toBe(140)
    })

    test('should handle empty responses', async () => {
      const mockTimestamps = [
        new Date('2024-01-01').getTime(),
        new Date('2024-01-04').getTime(),
      ]

      vi.mocked(getTimestampsBetweenDatesUsingDuration).mockReturnValue(mockTimestamps)

      // Mock empty responses
      vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse([]))

      const result = await pageThroughNightscoutEGVs(mockBaseUrl, mockToken, mockCountPerRequest, mockSince)

      expect(result).toEqual([])
    })

    test('should handle fetch errors in some time periods', async () => {
      const mockTimestamps = [
        new Date('2024-01-01').getTime(),
        new Date('2024-01-04').getTime(),
        new Date('2024-01-07').getTime(),
      ]

      vi.mocked(getTimestampsBetweenDatesUsingDuration).mockReturnValue(mockTimestamps)

      // First request succeeds, second fails
      vi.mocked(fetch)
        .mockResolvedValueOnce(createFetchResponse([{ date: mockTimestamps[0], sgv: 120, type: 'sgv' }]))
        .mockRejectedValueOnce(new Error('Network error'))

      const result = await pageThroughNightscoutEGVs(mockBaseUrl, mockToken, mockCountPerRequest, mockSince)

      // Should still return data from successful request
      expect(result).toHaveLength(1)
      expect(result[0].value).toBe(120)
    })

    test('should handle no timestamps', async () => {
      vi.mocked(getTimestampsBetweenDatesUsingDuration).mockReturnValue([])

      const result = await pageThroughNightscoutEGVs(mockBaseUrl, mockToken, mockCountPerRequest, mockSince)

      expect(result).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })
  })
})
