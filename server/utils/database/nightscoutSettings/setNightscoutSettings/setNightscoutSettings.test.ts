import { test, expect, describe, vi, beforeEach } from 'vitest'
import { MockSupabaseClient } from '../../../test/mockSupabase'
import { setNightscoutSettings } from './setNightscoutSettings'
import type { Database } from '~/types/database.types'

// Mock the createError function since it's from Nuxt
vi.mock('#imports', () => ({
  createError: (params: { statusCode: number, statusMessage: string }) => {
    throw new Error(params.statusMessage)
  },
}))

describe('setNightscoutSettings', () => {
  const mockSupabase = new MockSupabaseClient()
  const userId = 'test-user'
  const baseUrl = 'https://test.nightscout.com'
  const token = 'test-token'
  const now = new Date().toISOString()
  const mockSettings: Database['public']['Tables']['nightscout_settings']['Row'] = {
    user_id: userId,
    base_url: baseUrl,
    token,
    created_at: now,
    updated_at: now,
  }

  beforeEach(() => {
    mockSupabase.resetMocks()
  })

  test('should successfully set nightscout settings', async () => {
    mockSupabase.setMockData('nightscout_settings', [mockSettings])

    const result = await setNightscoutSettings(userId, baseUrl, token, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('nightscout_settings')
    mockSupabase.verifyUpsertCalled({ user_id: userId, base_url: baseUrl, token })
    expect(result).toEqual(mockSettings)
  })

  test('should throw error when settings update fails', async () => {
    const mockError = new Error('Update failed')
    mockSupabase.setMockError(mockError)

    await expect(setNightscoutSettings(userId, baseUrl, token, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to set nightscout settings: Update failed')
  })
})
