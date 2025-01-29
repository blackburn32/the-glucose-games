<template>
  <div class="flex flex-col w-full items-center space-y-4">
    <div class="text-4xl font-bold mt-10">
      Your Gaming Records
    </div>
    <div v-if="!hasDexcom">
      <NuxtLink
        class="btn btn-outline"
        to="/connect"
      >
        Get Connected to Play
      </NuxtLink>
    </div>
    <HistoryViewer v-if="hasDexcom" />
  </div>
</template>

<script setup lang="ts">
const { hasDexcom } = useTokenStatus()
</script>
