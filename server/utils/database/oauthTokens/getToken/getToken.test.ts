import { test, expect, describe, vi, beforeEach } from 'vitest'
import { MockSupabaseClient } from '../../../test/mockSupabase'
import { getToken } from './getToken'
import type { Database } from '~/types/database.types'

// Mock the createError function since it's from Nuxt
vi.mock('#imports', () => ({
  createError: (params: { statusCode: number, statusMessage: string }) => {
    throw new Error(params.statusMessage)
  },
}))

describe('getToken', () => {
  const mockSupabase = new MockSupabaseClient()
  const userId = 'test-user'
  const provider = 'test-provider'
  const mockTokenData: Database['public']['Tables']['oauth_tokens']['Row'] = {
    id: 'test-id',
    user_id: userId,
    provider,
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    scopes: ['test-scope'],
  }

  beforeEach(() => {
    mockSupabase.resetMocks()
  })

  test('should successfully get token', async () => {
    mockSupabase.setMockData('oauth_tokens', [mockTokenData])

    const result = await getToken(userId, provider, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('oauth_tokens')
    expect(result).toEqual(mockTokenData)
  })

  test('should return null when token not found', async () => {
    mockSupabase.setMockData('oauth_tokens', [])

    const result = await getToken(userId, provider, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('oauth_tokens')
    expect(result).toBeNull()
  })

  test('should throw error when retrieval fails', async () => {
    const mockError = new Error('Retrieval failed')
    mockSupabase.setMockError(mockError)

    await expect(getToken(userId, provider, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to get token')
  })
})
