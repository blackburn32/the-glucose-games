import type { Database } from '~/types/database.types'

export const useNightscout = () => {
  const supabase = useSupabaseClient<Database>()
  const supabaseUser = useSupabaseUser()

  const nightscoutSettingsRequest = useLazyAsyncData('nightscout_settings', async () => {
    if (!supabaseUser.value) return null
    const { data } = await supabase.from('nightscout_settings')
      .select('*')
      .eq('user_id', supabaseUser.value.id)
      .maybeSingle()
    return data
  }, { immediate: true, default: () => null })

  const nightscoutSettings = computed(() => nightscoutSettingsRequest.data.value)

  const setNightscoutSettings = async (base_url: string, token: string) => {
    if (!supabaseUser.value) return
    await supabase.from('nightscout_settings')
      .upsert({ user_id: supabaseUser.value.id, base_url, token })

    await nightscoutSettingsRequest.refresh()
  }

  const deleteNightscoutSettings = async () => {
    if (!supabaseUser.value) return
    await supabase.from('nightscout_settings')
      .delete().eq('user_id', supabaseUser.value.id)

    await nightscoutSettingsRequest.refresh()
  }

  const hasNightscout = computed(() => {
    return !!nightscoutSettings.value
  })

  return {
    deleteNightscoutSettings,
    hasNightscout,
    nightscoutSettings,
    setNightscoutSettings,
  }
}
