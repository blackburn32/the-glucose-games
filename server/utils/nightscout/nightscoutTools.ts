import { z } from 'zod'
import { NIGHTSCOUT_PROVIDER_NAME } from '~/types/constants'

const nightScoutRecordValidator = z.object({
  _id: z.string(),
  device: z.string(),
  date: z.number(),
  dateString: z.string(),
  sgv: z.number(),
  direction: z.string(),
  type: z.string(),
  filtered: z.number(),
  unfiltered: z.number(),
  rssi: z.number(),
  noise: z.number(),
  sysTime: z.string(),
  utcOffset: z.number(),
})

const nightScoutRecordArrayValidator = z.array(nightScoutRecordValidator)

export const nightScoutRecordToGlucoseRecord = (
  record: z.infer<typeof nightScoutRecordValidator>,
) => {
  const date = new Date(record.date)
  return {
    created: date,
    x: date.getTime(),
    y: record.sgv,
    value: record.sgv,
    provider: NIGHTSCOUT_PROVIDER_NAME,
    // trend: record.direction,
    // trendRate: record.trendRate,
    unit: record.type,
    // rateUnit: record.rateUnit,
  }
}

export const getNightscoutEGVs = async (baseUrl: string, token: string, count: number) => {
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
