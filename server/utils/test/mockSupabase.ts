import { vi, expect } from 'vitest'
import type { SupabaseClient, PostgrestError } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

type TableName = keyof Database['public']['Tables']
type MockResponse<T> = Promise<{ data: T | null, error: PostgrestError | null }>

export class MockSupabaseClient {
  private mockData: Record<string, unknown[]>
  private mockError: PostgrestError | null = null
  private mockDeleteError: PostgrestError | null = null
  private mockStoreError: PostgrestError | null = null
  private mockClient: SupabaseClient<Database>

  constructor() {
    this.mockData = {}
    this.mockClient = this.createMockClient()
  }

  private handleResponse<T>(data?: T, error?: PostgrestError | null): MockResponse<T> {
    if (error) {
      return Promise.resolve({ data: null, error })
    }
    return Promise.resolve({ data: data || null, error: null })
  }

  private getCurrentTableData() {
    const tableData = this.mockData[Object.keys(this.mockData)[0]]
    return tableData?.[0] || null
  }

  private createPostgrestError(error: Error): PostgrestError {
    return {
      message: error.message,
      details: error.message,
      hint: '',
      code: 'ERROR',
      name: 'PostgrestError',
    }
  }

  createMockClient() {
    const selectMock = vi.fn().mockImplementation(() => {
      const eqBuilder = (_column: string, _value: string) => {
        const eqChain = {
          eq: vi.fn().mockImplementation((_column2: string, _value2: string) => ({
            maybeSingle: () => this.handleResponse(this.getCurrentTableData(), this.mockError),
          })),
          maybeSingle: () => this.handleResponse(this.getCurrentTableData(), this.mockError),
        }
        return eqChain
      }
      return {
        eq: vi.fn().mockImplementation(eqBuilder),
        maybeSingle: () => this.handleResponse(this.getCurrentTableData(), this.mockError),
      }
    })

    const deleteMock = vi.fn()
    const eqMock = vi.fn()
    const eqChainMock = vi.fn()

    eqMock.mockImplementation((_column: string, _value: string) => {
      const chain = {
        eq: eqChainMock.mockImplementation((_column2: string, _value2: string) => {
          if (this.mockDeleteError) {
            return Promise.resolve({ data: null, error: this.mockDeleteError })
          }
          return Promise.resolve({ data: [], error: null })
        }),
      }
      return chain
    })

    deleteMock.mockImplementation(() => ({
      eq: eqMock,
    }))

    const insertMock = vi.fn().mockImplementation((data: Record<string, unknown>) => {
      if (this.mockStoreError) {
        return {
          select: () => ({
            single: () => Promise.resolve({ data: null, error: this.mockStoreError }),
          }),
        }
      }
      const mockData = this.getCurrentTableData()
      if (mockData) {
        return {
          select: () => ({
            single: () => Promise.resolve({ data: mockData, error: null }),
          }),
        }
      }
      return {
        select: () => ({
          single: () => Promise.resolve({ data, error: null }),
        }),
      }
    })

    const upsertMock = vi.fn().mockImplementation((data: Record<string, unknown>) => ({
      single: () => {
        if (this.mockError) {
          throw new Error(`Failed to set nightscout settings: ${this.mockError.message}`)
        }
        const mockData = this.getCurrentTableData()
        if (mockData) {
          return Promise.resolve({ data: mockData, error: null })
        }
        return Promise.resolve({ data, error: null })
      },
    }))

    const fromMock = vi.fn().mockImplementation(() => ({
      delete: deleteMock,
      insert: insertMock,
      select: selectMock,
      upsert: upsertMock,
    }))

    return {
      from: fromMock,
    } as unknown as SupabaseClient<Database>
  }

  resetMocks(): void {
    this.mockData = {}
    this.mockError = null
    this.mockDeleteError = null
    this.mockStoreError = null
    this.mockClient = this.createMockClient()
  }

  setMockData(table: string, data: unknown[]): void {
    this.mockData[table] = data
  }

  /**
   * Sets a mock error for general select operations and upsert operations.
   * This error will be returned by select().eq().maybeSingle() and upsert().single()
   * @param error - The error to set, or null to clear the error
   */
  setMockError(error: Error | null) {
    this.mockError = error ? this.createPostgrestError(error) : null
  }

  /**
   * Sets a mock error specifically for delete operations.
   * This error will be returned by delete().eq().eq()
   * @param error - The error to set, or null to clear the error
   */
  setMockDeleteError(error: Error | null) {
    this.mockDeleteError = error ? this.createPostgrestError(error) : null
  }

  /**
   * Sets a mock error specifically for insert operations.
   * This error will be returned by insert()
   * @param error - The error to set, or null to clear the error
   */
  setMockStoreError(error: Error | null) {
    this.mockStoreError = error ? this.createPostgrestError(error) : null
  }

  getMockClient(): SupabaseClient<Database> {
    return this.mockClient
  }

  verifyFromCalled(table: TableName): void {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    expect(fromMock).toHaveBeenCalledWith(table)
  }

  verifyInsertCalled(data: Record<string, unknown>) {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    const insertMock = fromMock('oauth_tokens').insert as unknown as ReturnType<typeof vi.fn>

    expect(fromMock).toHaveBeenCalledWith('oauth_tokens')
    expect(insertMock).toHaveBeenCalledWith(data)
  }

  verifyDeleteCalled(column1: string, value1: string, column2: string, value2: string) {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    const deleteMock = fromMock('oauth_tokens').delete as unknown as ReturnType<typeof vi.fn>
    const eqMock = deleteMock().eq as unknown as ReturnType<typeof vi.fn>
    const eqChainMock = eqMock(column1, value1).eq as unknown as ReturnType<typeof vi.fn>

    expect(fromMock).toHaveBeenCalledWith('oauth_tokens')
    expect(deleteMock).toHaveBeenCalled()
    expect(eqMock).toHaveBeenCalledWith(column1, value1)
    expect(eqChainMock).toHaveBeenCalledWith(column2, value2)
  }

  verifySelectCalled(): void {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    const selectMock = fromMock('oauth_tokens').select as unknown as ReturnType<typeof vi.fn>
    expect(selectMock).toHaveBeenCalled()
  }

  verifyUpsertCalled(data: Record<string, unknown>) {
    const fromMock = this.mockClient.from as unknown as ReturnType<typeof vi.fn>
    const upsertMock = fromMock('nightscout_settings').upsert as unknown as ReturnType<typeof vi.fn>

    expect(fromMock).toHaveBeenCalledWith('nightscout_settings')
    expect(upsertMock).toHaveBeenCalledWith(data)
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
