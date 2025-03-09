import { test, expect, describe, vi, beforeEach } from 'vitest'
import { MockSupabaseClient } from '../../../test/mockSupabase'
import { storeToken, safeStoreToken } from './storeToken'
import type { Database } from '~/types/database.types'

// Mock the createError function since it's from Nuxt
vi.mock('#imports', () => ({
  createError: (params: { statusCode: number, statusMessage: string }) => {
    throw new Error(params.statusMessage)
  },
}))

// Mock the deleteToken function
vi.mock('./deleteToken', () => ({
  deleteToken: vi.fn().mockResolvedValue(undefined),
}))

describe('storeToken', () => {
  const mockTokenData: Database['public']['Tables']['oauth_tokens']['Insert'] = {
    user_id: 'test-user',
    provider: 'test-provider',
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    scopes: ['test-scope'],
  }

  const mockSupabase = new MockSupabaseClient()

  beforeEach(() => {
    mockSupabase.resetMocks()
  })

  test('should successfully store token', async () => {
    const result = await storeToken(mockTokenData, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('oauth_tokens')
    mockSupabase.verifyInsertCalled(mockTokenData)
    expect(result).toEqual(mockTokenData)
  })

  test('should throw error when storage fails', async () => {
    const mockError = new Error('Storage failed')
    mockSupabase.setMockError(mockError)

    await expect(storeToken(mockTokenData, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to store token')
  })
})

describe('safeStoreToken', () => {
  const mockTokenData: Database['public']['Tables']['oauth_tokens']['Insert'] = {
    user_id: 'test-user',
    provider: 'test-provider',
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    scopes: ['test-scope'],
  }

  const mockSupabase = new MockSupabaseClient()

  beforeEach(() => {
    mockSupabase.resetMocks()
  })

  test('should successfully store token after deleting existing token', async () => {
    const result = await safeStoreToken(mockTokenData, mockSupabase.getMockClient())

    mockSupabase.verifyFromCalled('oauth_tokens')
    mockSupabase.verifyInsertCalled(mockTokenData)
    expect(result).toEqual(mockTokenData)
  })

  test('should throw error when user_id is missing', async () => {
    const { user_id, ...invalidTokenData } = mockTokenData
    const tokenDataWithoutUserId = invalidTokenData as Database['public']['Tables']['oauth_tokens']['Insert']

    await expect(safeStoreToken(tokenDataWithoutUserId, mockSupabase.getMockClient()))
      .rejects.toThrow('Missing required fields, user_id and provider are required')
  })

  test('should throw error when provider is missing', async () => {
    const { provider, ...invalidTokenData } = mockTokenData
    const tokenDataWithoutProvider = invalidTokenData as Database['public']['Tables']['oauth_tokens']['Insert']

    await expect(safeStoreToken(tokenDataWithoutProvider, mockSupabase.getMockClient()))
      .rejects.toThrow('Missing required fields, user_id and provider are required')
  })

  test('should throw error when storage fails', async () => {
    const mockError = new Error('Storage failed')
    mockSupabase.setMockError(mockError)

    await expect(safeStoreToken(mockTokenData, mockSupabase.getMockClient()))
      .rejects.toThrow('Failed to store token')
  })
})
