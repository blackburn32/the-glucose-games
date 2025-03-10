import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import type { Database } from '~/types/database.types.ts'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'
import { safeStoreToken } from '~/server/utils/database/oauthTokens/storeToken/storeToken'
import type { GlucoseRecord } from '~/types/glucoseRecord'

const dexcomTokenValidator = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
})

const dexcomRecordValidator = z.object({
  recordId: z.string(),
  systemTime: z.string(),
  displayTime: z.string(),
  value: z.number(),
  trend: z.string(),
  trendRate: z.number(),
  unit: z.string(),
  rateUnit: z.string(),
  displayDevice: z.string(),
  transmitterGeneration: z.string(),
})

const dexcomEGVResponseValidator = z.object({
  recordType: z.string(),
  recordVersion: z.string(),
  userId: z.string(),
  records: z.array(dexcomRecordValidator),
})

export const requestDexcomToken = async (
  userId: string,
  code: string,
  dexcomBaseUrl: string,
  clientId: string,
  clientSecret: string,
  redirectUrl: string,
  client: SupabaseClient<Database>,
) => {
  const formData = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUrl,
    client_id: clientId,
    client_secret: clientSecret,
  }

  return sendAndStoreTokenRequest(userId, formData, dexcomBaseUrl, client)
}

export const refreshDexcomTokenIfNecessary = async (
  userId: string,
  token: Database['public']['Tables']['oauth_tokens']['Row'],
  client: SupabaseClient<Database>,
  dexcomBaseUrl: string,
  clientId: string,
  clientSecret: string,
): Promise<Database['public']['Tables']['oauth_tokens']['Row']> => {
  const expired = new Date(token.expires_at) < new Date()
  if (!expired) {
    return token
  }

  const formData = {
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: token.refresh_token,
  }

  return sendAndStoreTokenRequest(userId, formData, dexcomBaseUrl, client)
}

export const sendAndStoreTokenRequest = async (
  userId: string,
  formData: Record<string, string>,
  dexcomBaseUrl: string,
  client: SupabaseClient<Database>,
): Promise<Database['public']['Tables']['oauth_tokens']['Row']> => {
  const resp = await fetch(
    `${dexcomBaseUrl}/v2/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString(),
    },
  )

  const data = await resp.json()
  const validatedResponse = dexcomTokenValidator.safeParse(data)
  if (!validatedResponse.success) {
    console.error('Failed to validate response', validatedResponse.error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to validate authorization response',
    })
  }

  return handleTokenResponse(userId, validatedResponse.data, client)
}

export const handleTokenResponse = async (
  userId: string,
  data: z.infer<typeof dexcomTokenValidator>,
  client: SupabaseClient<Database>,
): Promise<Database['public']['Tables']['oauth_tokens']['Row']> => {
  const tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    created_at: new Date().toISOString(),
    user_id: userId,
    scopes: ['offline_access'],
    provider: DEXCOM_PROVIDER_NAME,
  }
  return safeStoreToken(tokenData, client)
}

export const dexcomRecordToGlucoseRecord = (
  record: z.infer<typeof dexcomRecordValidator>,
): GlucoseRecord => {
  return {
    created: new Date(record.displayTime),
    x: new Date(record.displayTime).getTime(),
    y: record.value,
    value: record.value,
    provider: DEXCOM_PROVIDER_NAME,
    trend: record.trend,
    trendRate: record.trendRate,
    unit: record.unit,
    rateUnit: record.rateUnit,
  }
}

export const getEstimatedBloodGlucoseValuesFromDexcom = async (
  since: Date,
  until: Date,
  token: Database['public']['Tables']['oauth_tokens']['Row'],
  dexcomBaseUrl: string,
): Promise<GlucoseRecord[]> => {
  const sinceString = formatDateString(since)
  const untilString = formatDateString(until)

  const resp = await fetch(
    `${dexcomBaseUrl}/v3/users/self/egvs?startDate=${sinceString}&endDate=${untilString}`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    },
  )

  if (resp.status === 401) {
    console.error('Failed to get Dexcom EGV data', await resp.text())
    return []
  }
  const raw = await resp.json()
  const validatedResponse = dexcomEGVResponseValidator.safeParse(raw)
  if (!validatedResponse.success) {
    console.error('Failed to validate Dexcom EGV response', validatedResponse.error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to validate Dexcom EGV response',
    })
  }

  return validatedResponse.data.records.map(dexcomRecordToGlucoseRecord)
}

const formatDateString = (date: Date) => date.toISOString().split('.')[0]
