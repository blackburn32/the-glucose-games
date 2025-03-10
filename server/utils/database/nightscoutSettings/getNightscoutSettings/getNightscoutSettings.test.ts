import { test, expect, describe, vi, beforeEach } from 'vitest'
import { MockSupabaseClient } from '../../../test/mockSupabase'
import { getNightscoutSettings } from './getNightscoutSettings'
import type { Database } from '~/types/database.types'

// Mock the createError function since it's from Nuxt
vi.mock('#imports', () => ({
  createError: (params: { statusCode: number, statusMessage: string }) => {
    throw new Error(params.statusMessage)
  },
}))

describe('getNightscoutSettings', () => {
  const mockSupabase = new MockSupabaseClient()
  const userId = 'test-user'
  const now = new Date().toISOString()
  const mockSettings: Database['public']['Tables']['nightscout_settings']['Row'] = {
    user_id: userId,
    base_url: 'https://test.nightscout.com',
    token: 'test-token',
    created_at: now,
    updated_at: now,
  }

  beforeEach(() => {
    mockSupabase.resetMocks()
  })

  test('should successfully get nightscout settings', async () => {
    mockSupabase.setMockData('nightscout_settings', [mockSettings])

    const result = await getNightscoutSettings(userId, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('nightscout_settings')
    expect(result).toEqual(mockSettings)
  })

  test('should return null when settings not found', async () => {
    mockSupabase.setMockData('nightscout_settings', [])

    const result = await getNightscoutSettings(userId, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('nightscout_settings')
    expect(result).toBeNull()
  })

  test('should throw error when retrieval fails', async () => {
    const mockError = new Error('Retrieval failed')
    mockSupabase.setMockError(mockError)

    await expect(getNightscoutSettings(userId, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to get nightscout settings: Retrieval failed')
  })
})
