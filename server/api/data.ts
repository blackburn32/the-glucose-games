import { z } from 'zod'
import { DataManager } from '../utils/data/dataManager'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types.ts'

const validBody = z.object({
  end: z.string().optional(),
  start: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event)
  const { end, start } = validBody.parse(body)
  const endDate = end ? new Date(end) : undefined
  const startDate = start ? new Date(start) : undefined

  const supabase = serverSupabaseServiceRole<Database>(event)
  const runtimeConfig = useRuntimeConfig(event)
  const dataManager = new DataManager(user.id, supabase, runtimeConfig)

  const egvsFromAllProviders = await Promise.all([
    dataManager.getDexcomData(),
    dataManager.getNightscoutData(startDate, endDate),
  ])

  return egvsFromAllProviders.flat()
})
