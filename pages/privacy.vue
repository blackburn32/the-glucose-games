<template>
  <div class="flex flex-col w-full items-center py-12 px-4">
    <ContentRenderer
      v-if="privacyPolicy"
      class="prose"
      :value="privacyPolicy"
    />
    <div v-else>
      Privacy Policy not found
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: privacyPolicy } = await useAsyncData(() => queryCollection('content').path('/privacy').first())
</script>
