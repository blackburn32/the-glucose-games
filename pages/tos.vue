<template>
  <div class="flex flex-col w-full items-center py-12 px-4">
    <ContentRenderer
      v-if="termsOfService"
      class="prose"
      :value="termsOfService"
    />
    <div v-else>
      Terms of Service not found
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: termsOfService } = await useAsyncData(() => queryCollection('content').path('/terms').first())
</script>
