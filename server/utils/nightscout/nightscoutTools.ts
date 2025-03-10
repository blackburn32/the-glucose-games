import { z } from 'zod'
import { NIGHTSCOUT_PROVIDER_NAME } from '~/types/constants'
import type { GlucoseRecord } from '~/types/glucoseRecord'

const nightScoutRecordValidator = z.object({
  date: z.number(),
  sgv: z.number(),
  type: z.string(),
})

const nightScoutRecordArrayValidator = z.array(nightScoutRecordValidator)

export const nightScoutRecordToGlucoseRecord = (
  record: z.infer<typeof nightScoutRecordValidator>,
): GlucoseRecord => {
  const date = new Date(record.date)
  return {
    created: date,
    x: date.getTime(),
    y: record.sgv,
    value: record.sgv,
    provider: NIGHTSCOUT_PROVIDER_NAME,
    unit: record.type,
  }
}

export const getNightscoutEGVs = async (baseUrl: string, token: string, count: number): Promise<GlucoseRecord[]> => {
  const finalUrl = `${baseUrl}/api/v1/entries/sgv?token=${token}&count=${count}`
  const response = await fetch(
    finalUrl,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
  )
  const rawResponseBody = await response.json()
  const validatedResponse = nightScoutRecordArrayValidator.safeParse(rawResponseBody)
  if (!validatedResponse.success) {
    console.error('Failed to validate response', validatedResponse.error, rawResponseBody)
    return []
  }
  return validatedResponse.data.map(nightScoutRecordToGlucoseRecord)
}
