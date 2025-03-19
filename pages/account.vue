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
      <label class="form-control w-full md:col-span-2">
        <div class="label">
          <span class="label-text">Target Blood Glucose</span>
        </div>
        <div class="flex flex-row w-full items-center space-x-4">
          <input
            v-model="target"
            type="range"
            min="80"
            max="180"
            step="1"
            class="range range-primary grow"
          >
          <input
            v-model="target"
            type="number"
            min="80"
            max="180"
            placeholder="Type here"
            class="input input-bordered w-full max-w-32"
          >
        </div>
        <div class="label">
          <span class="label-text-alt">Used to rank your average blood glucose across days</span>
        </div>
      </label>
      <label class="form-control w-full md:col-span-2">
        <div class="label">
          <span class="label-text">Daily Streak Percent Time in Range Threshold</span>
        </div>
        <div class="flex flex-row w-full items-center space-x-4">
          <input
            v-model="dailyStreakPercentThreshold"
            type="range"
            min="0"
            max="100"
            step="1"
            class="range range-primary grow"
          >
          <input
            v-model="dailyStreakPercentThreshold"
            type="number"
            min="0"
            max="100"
            placeholder="Type here"
            class="input input-bordered w-full max-w-32"
          >
        </div>
        <div class="label">
          <span class="label-text-alt">Used to calculate whether or not your percent time in range scores will count towards your daily streak</span>
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
    <div class="flex flex-col w-full max-w-xl mt-4 space-y-4">
      <NightscoutConnector />
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
import { DEFAULT_THRESHOLDS } from '~/types/constants'

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

const tempDailyStreakPercent = ref<number | undefined>(undefined)
const dailyStreakPercentThreshold = computed({
  get() {
    if (tempDailyStreakPercent.value !== undefined) return tempDailyStreakPercent.value
    return thresholds.value?.dailyStreakPercentTimeInRange ?? DEFAULT_THRESHOLDS.dailyStreakPercentTimeInRange
  },
  set(value) {
    tempDailyStreakPercent.value = value
  },
})

const tempTarget = ref<number | undefined>(undefined)
const target = computed({
  get() {
    if (tempTarget.value !== undefined) return tempTarget.value
    return thresholds.value?.target ?? DEFAULT_THRESHOLDS.target
  },
  set(value) {
    tempTarget.value = value
  },
})

watch(() => thresholds.value, () => {
  lowThreshold.value = thresholds.value?.low ?? DEFAULT_THRESHOLDS.low
  highThreshold.value = thresholds.value?.high ?? DEFAULT_THRESHOLDS.high
  target.value = thresholds.value?.target ?? DEFAULT_THRESHOLDS.target
  dailyStreakPercentThreshold.value = thresholds.value?.dailyStreakPercentTimeInRange ?? DEFAULT_THRESHOLDS.dailyStreakPercentTimeInRange
})

const changesToSave = computed(() => {
  return lowThreshold.value !== thresholds.value?.low
    || highThreshold.value !== thresholds.value?.high
    || target.value !== thresholds.value?.target
    || dailyStreakPercentThreshold.value !== thresholds.value?.dailyStreakPercentTimeInRange
})

const saveThresholds = async () => {
  if (!changesToSave.value) return
  await setThresholds({
    low: lowThreshold.value,
    high: highThreshold.value,
    target: target.value,
    dailyStreakPercentTimeInRange: dailyStreakPercentThreshold.value,
  })
}

const resetThresholds = () => {
  tempLow.value = undefined
  tempHigh.value = undefined
}
</script>
