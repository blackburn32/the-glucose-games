import { DataManager } from '../utils/data/dataManager'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types.ts'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)
  const runtimeConfig = useRuntimeConfig(event)
  const dataManager = new DataManager(user.id, supabase, runtimeConfig)

  const egvsFromAllProviders = await Promise.all([
    dataManager.getDexcomData(),
    dataManager.getNightscoutData(),
  ])

  return egvsFromAllProviders.flat()
})
