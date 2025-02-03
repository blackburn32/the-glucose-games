<template>
  <div class="flex flex-col w-full items-center px-2">
    <div class="text-4xl font-bold mt-10">
      Account
    </div>
    <div class="text-2xl w-full md:max-w-xl font-semibold mt-8">
      Thresholds
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 w-full max-w-xl gap-4">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Low Threshold</span>
        </div>
        <input
          v-model="lowThreshold"
          type="number"
          min="40"
          max="100"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
        >
        <div class="label">
          <span class="label-text-alt">Must be between 40 and 100</span>
        </div>
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">High Threshold</span>
        </div>
        <input
          v-model="highThreshold"
          type="number"
          min="120"
          max="400"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
        >
        <div class="label">
          <span class="label-text-alt">Must be between 120 and 400</span>
        </div>
      </label>
      <div
        class="btn btn-outline"
        :class="{ 'btn-disabled': !changesToSave }"
        @click="resetThresholds"
      >
        Cancel
      </div>
      <div
        class="btn btn-primary"
        :class="{ 'btn-disabled': !changesToSave }"
        @click="saveThresholds"
      >
        Save
      </div>
    </div>
    <div class="text-2xl w-full md:max-w-xl font-semibold mt-8">
      Connections
    </div>
    <div class="flex flex-col w-full max-w-xl mt-4">
      <DexcomConnector />
    </div>
    <div class="text-2xl w-full md:max-w-xl font-semibold mt-8">
      Danger Zone
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 w-full max-w-xl mt-4 gap-4">
      <div
        class="btn btn-outline"
        @click="triggerSignOut"
      >
        Sign Out
      </div>
      <div
        class="btn btn-outline btn-error"
        @click="deleteAccount"
      >
        Delete Account
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { thresholds, setThresholds } = useThresholds()
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

const tempLow = ref<number | undefined>(undefined)
const lowThreshold = computed({
  get() {
    if (tempLow.value !== undefined) return tempLow.value
    return thresholds.value?.low ?? 70
  },
  set(value) {
    tempLow.value = value
  },
})

const tempHigh = ref<number | undefined>(undefined)
const highThreshold = computed({
  get() {
    if (tempHigh.value !== undefined) return tempHigh.value
    return thresholds.value?.high ?? 180
  },
  set(value) {
    tempHigh.value = value
  },
})

watch(() => thresholds.value, () => {
  lowThreshold.value = thresholds.value?.low ?? 70
  highThreshold.value = thresholds.value?.high ?? 180
})

const changesToSave = computed(() => {
  return lowThreshold.value !== thresholds.value?.low || highThreshold.value !== thresholds.value?.high
})

const saveThresholds = async () => {
  if (!changesToSave.value) return
  await setThresholds({
    low: lowThreshold.value,
    high: highThreshold.value,
  })
}

const resetThresholds = () => {
  tempLow.value = undefined
  tempHigh.value = undefined
}
</script>
