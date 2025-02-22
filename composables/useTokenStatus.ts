import type { Database } from '~/types/database.types.ts'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'

export const useTokenStatus = () => {
  const supabase = useSupabaseClient<Database>()
  const supabaseUser = useSupabaseUser()

  const allTokensForUser = useAsyncData('tokens', async () => {
    if (!supabaseUser.value) return []
    const { data } = await supabase.from('oauth_tokens').select('provider')
    return data?.map(token => token.provider) ?? [] as string[]
  }, {
    default: () => [] as string[],
  })

  const deleteToken = async (provider: string) => {
    if (!supabaseUser.value) return
    await supabase.from('oauth_tokens').delete().match({ provider, user_id: supabaseUser.value.id })
    await allTokensForUser.refresh()
  }

  const hasDexcom = computed(() => allTokensForUser.data.value?.includes(DEXCOM_PROVIDER_NAME) ?? [])

  return {
    allTokensForUser,
    hasDexcom,
    deleteToken,
  }
}
