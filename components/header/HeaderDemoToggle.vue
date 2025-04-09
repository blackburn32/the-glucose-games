<template>
  <div
    class="flex flex-row items-center space-x-2 md:mr-8"
  >
    <div
      v-if="user"
      class="md:text-lg"
    >
      Demo mode:
    </div>
    <input
      v-if="user"
      v-model="useDemoDataOverride"
      type="checkbox"
      class="toggle"
    >
    <div
      v-if="!user"
      class="md:text-lg"
    >
      Randomize data
    </div>
    <Icon
      name="ph:arrow-counter-clockwise"
      class="cursor-pointer hover:scale-105"
      :class="{
        invisible: !useDemoData,
      }"
      size="24"
      @click="nuxtApp.$randomizeDemoData()"
    />
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const nuxtApp = useNuxtApp()
const useDemoDataOverride = nuxtApp.$useDemoDataOverride
const useDemoData = nuxtApp.$useDemoData
</script>
