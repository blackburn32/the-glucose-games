import { z } from 'zod'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'
import { setNightscoutSettings } from '~/server/utils/database/nightscoutSettings/setNightscoutSettings/setNightscoutSettings'

const validBody = z.object({
  baseUrl: z.string(),
  token: z.string(),
})

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const rawJson = event.toJSON()
  const body = validBody.safeParse(rawJson)
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)

  await setNightscoutSettings(user.id, body.data.baseUrl, body.data.token, supabase)

  return {
    statusCode: 200,
    body: 'OK',
  }
})
