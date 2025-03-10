import { test, expect, describe, vi, beforeEach } from 'vitest'
import { MockSupabaseClient } from '../../../test/mockSupabase'
import { deleteToken } from './deleteToken'

// Mock the createError function since it's from Nuxt
vi.mock('#imports', () => ({
  createError: (params: { statusCode: number, statusMessage: string }) => {
    throw new Error(params.statusMessage)
  },
}))

describe('deleteToken', () => {
  const mockSupabase = new MockSupabaseClient()
  const userId = 'test-user'
  const provider = 'test-provider'

  beforeEach(() => {
    mockSupabase.resetMocks()
  })

  test('should successfully delete token', async () => {
    await deleteToken(userId, provider, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('oauth_tokens')
    mockSupabase.verifyDeleteCalled('user_id', userId, 'provider', provider)
  })

  test('should throw error when deletion fails', async () => {
    const mockError = new Error('Deletion failed')
    mockSupabase.setMockDeleteError(mockError)

    await expect(deleteToken(userId, provider, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to delete token: Deletion failed')
  })
})
