<template>
  <div class="flex flex-col w-full items-center space-y-4 px-2">
    <div class="text-4xl font-bold mt-10">
      Current Games
    </div>
    <div v-if="!hasDexcom">
      <NuxtLink
        class="btn btn-outline"
        to="/connect"
      >
        Get Connected to Play
      </NuxtLink>
    </div>
    <GameViewer
      v-if="hasDexcom"
      :thresholds="thresholds"
    />
  </div>
</template>

<script setup lang="ts">
const { thresholds } = useThresholds()
const {
  hasDexcom,
} = useTokenStatus()
</script>
