<template>
  <div class="flex flex-col w-full space-y-2 items-center">
    <div class="flex flex-col w-full space-y-1">
      <div class="flex flex-row w-full justify-between">
        <div class="text-xl w-full underline">
          Nightscout
        </div>
        <div
          v-if="hasNightscoutData && !isGlucoseDataLoading"
          class="flex flex-row items-center space-x-2"
        >
          <div>
            Connected
          </div>
          <Icon
            v-if="hasNightscoutData"
            name="ph:check-circle"
            size="24"
            class="text-primary"
          />
        </div>
        <div
          v-if="hasNightscout && !hasNightscoutData && !isGlucoseDataLoading"
          class="flex flex-row items-center space-x-2"
        >
          <div>
            Error
          </div>
          <Icon
            name="ph:warning-circle"
            size="24"
            class="text-secondary"
          />
        </div>
        <div
          v-if="hasNightscout && isGlucoseDataLoading"
          class="flex flex-row items-center space-x-2"
        >
          <div>
            Loading
          </div>
          <div class="loading loading-spinner" />
        </div>
      </div>
    </div>
    <div class="flex flex-col w-full">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">
          Base Url
        </legend>
        <input
          v-model="baseUrl"
          class="input input-bordered w-full"
          :disabled="!user"
          :placeholder="user ? 'Enter Nightscout URL' : signInString"
        >
        <div class="flex flex-col w-full px-1 mt-2">
          <span class="fieldset-label">Example: https://exampleNightscoutUrl.com</span>
          <span
            class="fieldset-label text-xs"
            :class="{
              'text-error': baseUrlHasTrailingSlash,
            }"
          >• No trailing slash</span>
          <span
            class="fieldset-label text-xs"
            :class="{
              'text-error': baseUrlHasApi,
            }"
          >• No /api/...</span>
          <span
            class="fieldset-label text-xs"
            :class="{
              'text-error': baseUrlHasToken,
            }"
          >• No ?token=...</span>
        </div>
      </fieldset>
      <fieldset class="fieldset w-full mt-2">
        <div class="fieldset-label">
          Token
        </div>
        <div class="input input-bordered flex items-center gap-2 w-full">
          <input
            v-model="token"
            :type="tokenInputType"
            class="grow"
            :disabled="!user"
            :placeholder="user ? `Enter Nightscout token` : signInString"
          >
          <Icon
            :name="showToken ? 'ph:eye' : 'ph:eye-closed'"
            size="24"
            class="cursor-pointer"
            @click="showToken = !showToken"
          />
        </div>
        <div class="flex flex-col w-full px-1 mt-2">
          <span class="fieldset-label text-xs">Follow
            <NuxtLink
              to="/aboutNightscout#getting-your-nightscout-access-token"
              target="_blank"
              class="underline"
            >these</NuxtLink>
            directions to create a valid token
          </span>
        </div>
      </fieldset>
      <div class="flex flex-row w-full items-center space-x-2 mt-4">
        <button
          class="btn btn-soft grow"
          :class="{
            'btn-disabled': !baseUrlTemp && !tokenTemp,
          }"
          @click="cancelSettings"
        >
          Cancel
        </button>
        <button
          class="btn btn-primary grow"
          :class="{
            'btn-disabled': !baseUrlTemp && !tokenTemp,
          }"
          @click="saveSettings"
        >
          Save
        </button>
        <button
          v-if="hasNightscout"
          class="btn btn-soft btn-error"
          @click="deleteNightscoutSettings"
        >
          <Icon
            name="ph:trash"
            size="24"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const {
  deleteNightscoutSettings,
  hasNightscout,
  nightscoutSettings,
  setNightscoutSettings,
} = useNightscout()

const user = useSupabaseUser()

const signInString = 'Sign in to set this value'

const nuxtApp = useNuxtApp()
const hasNightscoutData = nuxtApp.$hasNightscoutData
const isGlucoseDataLoading = nuxtApp.isGlucoseDataLoading

const baseUrlTemp = ref<string | undefined>(undefined)
const baseUrl = computed({
  get() {
    if (baseUrlTemp.value) {
      return baseUrlTemp.value
    }
    if (nightscoutSettings.value) {
      return nightscoutSettings.value.base_url
    }
    return undefined
  },
  set(value) {
    baseUrlTemp.value = value
  },
})

const baseUrlHasTrailingSlash = computed(() => baseUrl.value?.endsWith('/'))
const baseUrlHasApi = computed(() => baseUrl.value?.includes('/api/'))
const baseUrlHasToken = computed(() => baseUrl.value?.includes('?token='))

const showToken = ref(false)
const tokenInputType = computed(() => showToken.value ? 'text' : 'password')

const tokenTemp = ref<string | undefined>(undefined)
const token = computed({
  get() {
    if (tokenTemp.value) {
      return tokenTemp.value
    }
    if (nightscoutSettings.value) {
      return nightscoutSettings.value.token
    }
    return undefined
  },
  set(value) {
    tokenTemp.value = value
  },
})

const saveSettings = async () => {
  if (!baseUrl.value || !token.value || baseUrlHasTrailingSlash.value || baseUrlHasApi.value || baseUrlHasToken.value) {
    toast.add({
      title: 'Error',
      description: 'Please enter a valid URL and token',
      color: 'error',
    })
    return
  }

  await setNightscoutSettings(
    baseUrl.value,
    token.value,
  )
  baseUrlTemp.value = undefined
  tokenTemp.value = undefined
  toast.add({
    title: 'Success',
    description: 'Settings saved',
    color: 'success',
  })
}

const cancelSettings = () => {
  baseUrlTemp.value = undefined
  tokenTemp.value = undefined
}
</script>
