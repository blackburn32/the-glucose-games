<template>
  <div class="flex flex-col w-full space-y-4 items-center max-w-lg">
    <div class="flex flex-col w-full space-y-1">
      <div class="text-2xl w-full underline">
        Dexcom
      </div>
      <div
        v-if="!isAdmin"
        class="text-lg w-full leading-tight"
      >
        Coming Soon, stay tuned! Waiting for Dexcom's approval.
      </div>
    </div>
    <div class="flex flex-row space-x-4">
      <div
        class="btn btn-primary"
        :class="{
          'btn-disabled': !isAdmin,
        }"
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
  </div>
</template>

<script setup lang="ts">
import { useTokenStatus } from '~/composables/useTokenStatus'
import { DEXCOM_PROVIDER_NAME } from '~/types/constants'
import { useUserRole } from '~/composables/useUserRole'

const toast = useToast()
const { isAdmin } = useUserRole()

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
