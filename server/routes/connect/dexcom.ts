import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const runtimeConfig = useRuntimeConfig(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const dexcomBaseUrl = runtimeConfig.dexcomBaseUrl
  const dexcomClientId = runtimeConfig.dexcomClientId
  const redirectUrl = runtimeConfig.dexcomRedirectUrl

  const url = `${dexcomBaseUrl}/v2/oauth2/login?client_id=${dexcomClientId}&redirect_uri=${redirectUrl}&response_type=code&scope=offline_access&state=${user.id}`

  await sendRedirect(event, url)
})
