import { z } from 'zod'
import { DataManager } from '../utils/data/dataManager'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types.ts'

const validBody = z.object({
  end: z.string().optional(),
  start: z.string().optional(),
})

const validError = z.object({
  statusMessage: z.string(),
})

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      return []
    }

    const body = await readBody(event)
    const { end, start } = validBody.parse(body)
    const endDate = end ? new Date(end) : undefined
    const startDate = start ? new Date(start) : undefined

    const supabase = serverSupabaseServiceRole<Database>(event)
    const dataManager = new DataManager(user.id, supabase)

    const egvsFromAllProviders = await Promise.all([
      dataManager.getNightscoutData(startDate, endDate),
    ])

    return egvsFromAllProviders.flat()
  }
  catch (e) {
    if (validError.safeParse(e).data?.statusMessage === 'Auth session missing!') {
      return []
    }
    console.error(e)
    return []
  }
})
