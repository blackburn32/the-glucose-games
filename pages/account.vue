<template>
  <DashboardPanelWithHeader
    id="settings"
    title="Settings"
  >
    <div class="flex flex-col w-full items-center px-2 mb-10">
      <div class="text-2xl w-full md:max-w-xl font-semibold mt-8">
        Thresholds
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 w-full max-w-xl gap-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            Low Threshold
          </legend>
          <input
            v-model="lowThreshold"
            type="number"
            :min="lowThresholdBounds.min"
            :max="lowThresholdBounds.max"
            placeholder="Type here"
            class="input input-bordered w-full max-w-xs"
          >
          <div class="fieldset-label">
            Must be between {{ lowThresholdBounds.min }} and {{ lowThresholdBounds.max }}
          </div>
        </fieldset>
        <fieldset class="fieldset w-full max-w-xs">
          <legend class="fieldset-legend">
            High Threshold
          </legend>
          <input
            v-model="highThreshold"
            type="number"
            :min="highThresholdBounds.min"
            :max="highThresholdBounds.max"
            placeholder="Type here"
            class="input input-bordered w-full max-w-xs"
          >
          <div class="fieldset-label">
            Must be between {{ highThresholdBounds.min }} and {{ highThresholdBounds.max }}
          </div>
        </fieldset>
        <fieldset class="fieldset w-full md:col-span-2">
          <legend class="fieldset-legend">
            Target Blood Glucose
          </legend>
          <div class="flex flex-row w-full items-center space-x-4">
            <input
              v-model="target"
              type="range"
              :min="targetBloodGlucoseBounds.min"
              :max="targetBloodGlucoseBounds.max"
              :step="useMmol ? 0.1 : 1"
              class="range range-primary grow"
            >
            <input
              v-model="target"
              type="number"
              :min="targetBloodGlucoseBounds.min"
              :max="targetBloodGlucoseBounds.max"
              placeholder="Type here"
              class="input input-bordered w-full max-w-32"
            >
          </div>
          <div class="fieldset-label">
            Used to rank your average blood glucose across days
          </div>
        </fieldset>
        <fieldset class="fieldset w-full md:col-span-2">
          <legend class="fieldset-legend">
            Daily Streak Percent Time in Range Threshold
          </legend>
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
          <div class="fieldset-label">
            Used to calculate whether or not your percent time in range scores will count towards your daily streak
          </div>
        </fieldset>
        <div
          class="btn btn-soft"
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
        Display Settings
      </div>
      <div class="text-xl underline w-full md:max-w-xl mt-3">
        Glucose Display Unit
      </div>
      <div class="flex flex-row space-x-2 items-center w-full md:max-w-xl mt-2">
        <input
          v-model="useMmol"
          type="checkbox"
          class="toggle"
        >
        <div class="text-lg">
          {{ unit }}
        </div>
      </div>
      <div class="flex flex-row w-full md:max-w-xl items-center space-x-4" />
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
import { DEFAULT_THRESHOLDS } from '~/types/constants'

const { highThresholdBounds, lowThresholdBounds, setThresholds, targetBloodGlucoseBounds, thresholds } = useThresholds()
const { useMmol, unit, getGlucoseValueToDisplay } = useDisplaySettings()
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
    return thresholds.value?.low ?? getGlucoseValueToDisplay(DEFAULT_THRESHOLDS.low)
  },
  set(value) {
    tempLow.value = value
  },
})

const tempHigh = ref<number | undefined>(undefined)
const highThreshold = computed({
  get() {
    if (tempHigh.value !== undefined) return tempHigh.value
    return thresholds.value?.high ?? getGlucoseValueToDisplay(DEFAULT_THRESHOLDS.high)
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

watch(() => thresholds, () => {
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
  tempTarget.value = undefined
  tempDailyStreakPercent.value = undefined
}
</script>
