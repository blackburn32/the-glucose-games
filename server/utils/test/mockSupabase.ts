import { vi, expect } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

type TableName = keyof Database['public']['Tables']

export class MockSupabaseClient {
  private mockData: Record<string, unknown[]>
  private mockError: Error | null
  private mockClient: SupabaseClient<Database>

  constructor() {
    this.mockData = {}
    this.mockError = null
    this.mockClient = this.createMockClient()
  }

  private createMockClient(): SupabaseClient<Database> {
    const insertMock = vi.fn().mockImplementation((data) => {
      if (this.mockError) {
        return Promise.resolve({ data: null, error: this.mockError })
      }
      return Promise.resolve({ data, error: null })
    })

    const eqMock = vi.fn().mockImplementation(() => {
      if (this.mockError) {
        return Promise.resolve({ error: this.mockError })
      }
      return Promise.resolve({ error: null })
    })

    const eqChainMock = vi.fn().mockReturnValue({ eq: eqMock })

    const deleteMock = vi.fn().mockReturnValue({ eq: eqChainMock })

    const selectMock = vi.fn().mockImplementation(() => {
      if (this.mockError) {
        return Promise.resolve({ data: null, error: this.mockError })
      }
      return Promise.resolve({ data: this.mockData, error: null })
    })

    const fromMock = vi.fn().mockReturnValue({
      insert: insertMock,
      delete: deleteMock,
      select: selectMock,
    })

    return {
      from: fromMock,
    } as unknown as SupabaseClient<Database>
  }

  resetMocks(): void {
    this.mockData = {}
    this.mockError = null
    this.mockClient = this.createMockClient()
  }

  setMockData(table: string, data: unknown[]): void {
    this.mockData[table] = data
  }

  setMockError(error: Error | null): void {
    this.mockError = error
  }

  getMockClient(): SupabaseClient<Database> {
    return this.mockClient
  }

  // Helper methods to verify mock calls
  verifyFromCalled(table: TableName): void {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    expect(fromMock).toHaveBeenCalledWith(table)
  }

  verifyInsertCalled<T>(data: T): void {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    const insertMock = fromMock('oauth_tokens').insert as unknown as ReturnType<typeof vi.fn>
    expect(insertMock).toHaveBeenCalledWith(data)
  }

  verifyDeleteCalled(column1: string, value1: string, column2: string, value2: string): void {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    const deleteMock = fromMock('oauth_tokens').delete as unknown as ReturnType<typeof vi.fn>
    const eqChain = deleteMock().eq as unknown as ReturnType<typeof vi.fn>
    expect(eqChain).toHaveBeenCalledWith(column1, value1)
    expect(eqChain().eq).toHaveBeenCalledWith(column2, value2)
  }

  verifySelectCalled(): void {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    const selectMock = fromMock('oauth_tokens').select as unknown as ReturnType<typeof vi.fn>
    expect(selectMock).toHaveBeenCalled()
  }
}

// Example usage:
/*
const mockSupabase = new MockSupabaseClient()
const mockClient = mockSupabase.getMockClient()

// Set mock data
mockSupabase.setMockData('oauth_tokens', [
  {
    user_id: 'test-user',
    provider: 'test-provider',
    access_token: 'test-token',
  },
])

// Set mock error
mockSupabase.setMockError(new Error('Test error'))

// Reset mocks
mockSupabase.resetMocks()

// Verify calls
mockSupabase.verifyFromCalled('oauth_tokens')
mockSupabase.verifyInsertCalled({ user_id: 'test-user' })
mockSupabase.verifyDeleteCalled('user_id', 'test-user', 'provider', 'test-provider')
mockSupabase.verifySelectCalled()
*/
