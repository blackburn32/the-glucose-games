import { z } from 'zod'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types.ts'
import { requestDexcomToken } from '~/server/utils/dexcom/dexcomTokenTools.ts'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants.ts'

const validQuery = z.object({
  code: z.string(),
  state: z.string(),
})

export default defineEventHandler(async (event) => {
  const queryParams = await getValidatedQuery(event, validQuery.safeParse)
  if (!queryParams.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const supabase = serverSupabaseServiceRole<Database>(event)
  const runtimeConfig = useRuntimeConfig(event)

  const userId = queryParams.data.state
  await requestDexcomToken(
    userId,
    queryParams.data.code,
    runtimeConfig.dexcomBaseUrl,
    runtimeConfig.dexcomClientId,
    runtimeConfig.dexcomClientSecret,
    runtimeConfig.dexcomRedirectUrl,
    supabase,
  )

  await sendRedirect(event, `/success?provider=${DEXCOM_PROVIDER_NAME}`)
})
