<template>
  <div class="flex flex-row space-x-4">
    <UButton
      icon="i-arcticons-dexcom-g6"
      size="lg"
      :disabled="hasDexcom"
      @click="connectDexcom"
    >
      {{ dexcomText }}
    </UButton>
    <UButton
      v-if="hasDexcom"
      icon="i-heroicons-trash"
      :loading="deleting"
      size="lg"
      color="red"
      @click="deleteDexcom"
    />
  </div>
</template>

<script setup lang="ts">
import { useTokenStatus } from '~/composables/useTokenStatus'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'

const connectDexcom = async () => {
  navigateTo('/connect/dexcom', { external: true })
}

const { hasDexcom, deleteToken } = useTokenStatus()
const dexcomText = computed(() => hasDexcom.value ? 'Connected to Dexcom' : 'Connect to Dexcom')

const toast = useToast()

const deleting = ref(false)
const deleteDexcom = async () => {
  deleting.value = true
  await deleteToken(DEXCOM_PROVIDER_NAME).catch(
    (error) => {
      toast.add({
        title: 'Error',
        description: error.message,
        color: 'red',
      })
    },
  )
  deleting.value = false
}
</script>
