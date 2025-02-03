<template>
  <div class="flex flex-row space-x-4">
    <div
      class="btn btn-primary"
      @click="connectDexcom"
    >
      <Icon
        name="arcticons:dexcom-g6"
        size="24"
      />
      {{ dexcomText }}
    </div>
    <div
      v-if="hasDexcom"
      class="btn btn-error"
      @click="deleteDexcom"
    >
      <Icon
        name="ph:trash"
        size="24"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTokenStatus } from '~/composables/useTokenStatus'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'

const toast = useToast()

const connectDexcom = async () => {
  if (hasDexcom.value) {
    toast.add({
      title: 'Already connected',
      description: 'Dexcom already connected',
      color: 'green',
    })
    return
  }
  navigateTo('/connect/dexcom', { external: true })
}

const { hasDexcom, deleteToken } = useTokenStatus()
const dexcomText = computed(() => hasDexcom.value ? 'Connected to Dexcom' : 'Connect to Dexcom')

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
