import { z } from 'zod'
import { NIGHTSCOUT_PROVIDER_NAME, ONE_DAY } from '~/types/constants'
import type { GlucoseRecord } from '~/types/glucoseRecord'
import { getTimestampsBetweenDatesUsingDuration } from '~/utils/timing/timeSlicers'

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

export const pageThroughNightscoutEGVs = async (baseUrl: string, token: string, countPerRequest: number, start: Date, end: Date): Promise<GlucoseRecord[]> => {
  const threeDaysDuration = ONE_DAY * 3
  const timestamps = getTimestampsBetweenDatesUsingDuration(start, end, threeDaysDuration)
  const records: GlucoseRecord[] = []
  const promises: Promise<GlucoseRecord[]>[] = []
  for (let i = 0; i < timestamps.length; i++) {
    const timestamp = timestamps[i]
    const nextTimestamp = timestamps[i + 1] ?? end.getTime()
    promises.push(getNightscoutEGVs(baseUrl, token, countPerRequest, timestamp, nextTimestamp))
  }
  const results = await Promise.all(promises)
  for (const result of results) {
    records.push(...result)
  }
  return records
}

export const getNightscoutEGVs = async (baseUrl: string, token: string, count: number, timestamp: number, nextTimestamp?: number): Promise<GlucoseRecord[]> => {
  try {
    const upperBound = nextTimestamp ?? Date.now()
    const finalUrl = `${baseUrl}/api/v1/entries/sgv?token=${token}&count=${count}&find[date][$gte]=${timestamp}&find[date][$lt]=${upperBound}`
    const response = await fetch(
      finalUrl,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
    )
    let rawResponseBody
    try {
      rawResponseBody = await response.json()
    }
    catch (error) {
      console.error('Failed to parse JSON response', error)
      return []
    }
    const validatedResponse = nightScoutRecordArrayValidator.safeParse(rawResponseBody)
    if (!validatedResponse.success) {
      console.error('Failed to validate response', validatedResponse.error, rawResponseBody)
      return []
    }
    return validatedResponse.data.map(nightScoutRecordToGlucoseRecord)
  }
  catch (error) {
    console.error('Failed to fetch Nightscout data', error)
    return []
  }
}
