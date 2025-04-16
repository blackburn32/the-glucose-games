<template>
  <div>
    <div
      v-if="collapsed"
      class="flex flex-col items-center space-y-2"
    >
      <input
        :checked="!user || !hasNightscoutData || useDemoDataOverride"
        type="checkbox"
        class="toggle"
        :disabled="!user || !hasNightscoutData"
        @change="updateDemoMode($event)"
      >
      <Icon
        name="ph:arrow-counter-clockwise"
        size="24"
        class="cursor-pointer hover:scale-105"
        :class="{ invisible: !useDemoData }"
        @click="nuxtApp.$randomizeDemoData()"
      />
    </div>
    <UCard
      v-if="!collapsed"
      class="mb-4"
    >
      <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between">
          <span class="font-bold">Demo mode:</span>
          <input
            :checked="!user || !hasNightscoutData || useDemoDataOverride"
            type="checkbox"
            class="toggle"
            :disabled="!user || !hasNightscoutData"
            @change="updateDemoMode($event)"
          >
        </div>

        <UButton
          v-if="useDemoData"
          color="primary"
          variant="soft"
          block
          @click="nuxtApp.$randomizeDemoData()"
        >
          Randomize
        </UButton>
      </div>
      <div
        v-if="!user"
        class="text-xs mt-2"
      >
        <NuxtLink
          to="/login"
          class="underline"
        >Sign up</NuxtLink> and connect to <NuxtLink
          to="/about/nightscout"
          class="underline"
        >Nightscout</NuxtLink> to use your real data
      </div>
      <div
        v-if="user && !hasNightscoutData && !isGlucoseDataLoading"
        class="text-xs mt-2"
      >
        Connect to <NuxtLink
          to="/about/nightscout"
          class="underline"
        >Nightscout</NuxtLink> to use your real data
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  collapsed?: boolean | undefined
}>()
const user = useSupabaseUser()
const nuxtApp = useNuxtApp()
const useDemoDataOverride = nuxtApp.$useDemoDataOverride
const useDemoData = nuxtApp.$useDemoData
const hasNightscoutData = nuxtApp.$hasNightscoutData
const isGlucoseDataLoading = nuxtApp.$isGlucoseDataLoading

const updateDemoMode = (event: Event) => {
  if (user.value && hasNightscoutData.value) {
    useDemoDataOverride.value = (event.target as HTMLInputElement).checked
  }
}
</script>
