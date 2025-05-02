<template>
  <DashboardPanelWithHeader
    id="settings"
    title="Settings"
  >
    <div class="flex flex-col w-full items-center px-2 mb-10">
      <div class="text-2xl w-full md:max-w-xl font-semibold mt-8">
        Thresholds
      </div>
      <ThresholdSettings />
      <div class="text-2xl w-full md:max-w-xl font-semibold mt-8">
        Display Settings
      </div>
      <DisplaySettings />
      <div class="text-2xl w-full md:max-w-xl font-semibold mt-8">
        Connections
      </div>
      <div class="flex flex-col w-full max-w-xl mt-4 space-y-4">
        <NightscoutConnector />
      </div>
      <div
        v-if="user"
        class="text-2xl w-full md:max-w-xl font-semibold mt-8"
      >
        Danger Zone
      </div>
      <div
        v-if="user"
        class="grid grid-cols-1 md:grid-cols-2 w-full max-w-xl mt-4 gap-4"
      >
        <div
          class="btn btn-soft"
          @click="triggerSignOut"
        >
          Sign Out
        </div>
        <div
          class="btn btn-soft btn-error"
          @click="deleteAccount"
        >
          Delete Account
        </div>
      </div>
    </div>
  </DashboardPanelWithHeader>
</template>

<script setup lang="ts">
import ThresholdSettings from '~/components/account/ThresholdSettings.vue'
import DisplaySettings from '~/components/account/DisplaySettings.vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const triggerSignOut = async () => {
  await supabase.auth.signOut()
  navigateTo('/')
}

const deleteAccount = async () => {
  if (!user.value) return
  if (!confirm('Are you sure you want to delete your account?')) return
  await $fetch('/api/delete', {
    method: 'DELETE',
  }).catch(console.error)
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>
