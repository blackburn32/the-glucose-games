import { test, expect, describe, vi, beforeEach } from 'vitest'
import { MockSupabaseClient } from '../../../test/mockSupabase'
import { setNightscoutSettings } from './setNightscoutSettings'
import type { Database } from '~/types/database.types'

// Mock the createError function since it's from Nuxt
vi.mock('#imports', () => ({
  createError: (params: { statusCode: number, statusMessage: string }) => {
    const error = new Error(params.statusMessage)
    error.name = 'H3Error'
    return error
  },
}))

describe('setNightscoutSettings', () => {
  const mockSupabase = new MockSupabaseClient()
  const userId = 'test-user'
  const baseUrl = 'https://test.nightscout.com'
  const token = 'test-token'
  const mockSettings: Database['public']['Tables']['nightscout_settings']['Row'] = {
    user_id: userId,
    base_url: baseUrl,
    token,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  beforeEach(() => {
    mockSupabase.resetMocks()
  })

  test('should successfully set nightscout settings', async () => {
    mockSupabase.setMockData('nightscout_settings', [mockSettings])

    const result = await setNightscoutSettings(userId, baseUrl, token, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('nightscout_settings')
    mockSupabase.verifyUpsertCalled({ user_id: userId, base_url: baseUrl, token })

    // Verify only non-timestamp fields since timestamps will be different
    expect(result).toMatchObject({
      user_id: userId,
      base_url: baseUrl,
      token,
    })
    // Verify timestamp fields exist and are in ISO format
    expect((result as Database['public']['Tables']['nightscout_settings']['Row']).created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    expect((result as Database['public']['Tables']['nightscout_settings']['Row']).updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  test('should throw error when settings update fails', async () => {
    const mockError = new Error('Update failed')
    mockSupabase.setMockError(mockError)

    await expect(setNightscoutSettings(userId, baseUrl, token, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to set nightscout settings: Update failed')
  })

  test('should throw error with detailed error message when available', async () => {
    const mockError = {
      message: 'Update failed',
      details: 'Unique constraint violation',
      hint: 'User already exists',
      code: 'ERROR',
      name: 'PostgrestError',
    }
    mockSupabase.setMockError(mockError)

    await expect(setNightscoutSettings(userId, baseUrl, token, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to set nightscout settings: Update failed')
  })

  test('should handle empty response data', async () => {
    mockSupabase.setMockData('nightscout_settings', [])

    const result = await setNightscoutSettings(userId, baseUrl, token, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('nightscout_settings')
    mockSupabase.verifyUpsertCalled({
      user_id: userId,
      base_url: baseUrl,
      token,
    })
    expect(result).toEqual(expect.objectContaining({
      user_id: userId,
      base_url: baseUrl,
      token,
    }))
  })

  test('should log error details when settings update fails', async () => {
    const mockError = {
      message: 'Update failed',
      details: 'Update failed',
      hint: '',
      code: 'ERROR',
      name: 'PostgrestError',
    }

    const consoleSpy = vi.spyOn(console, 'error')
    mockSupabase.setMockError(mockError)

    try {
      await setNightscoutSettings('user123', 'http://example.com', 'token123', mockSupabase.getMockClient())
      // Should not reach here
      expect(true).toBe(false)
    }
    catch (error) {
      expect((error as Error).message).toBe('Failed to set nightscout settings: Update failed')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set nightscout settings', mockError)
    }

    consoleSpy.mockRestore()
  })
})
