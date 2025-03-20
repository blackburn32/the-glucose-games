<template>
  <div class="flex flex-col w-full items-center py-12 px-4">
    <ContentRenderer
      v-if="about"
      class="prose"
      :value="about"
    />
    <div v-else>
      About not found
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: about } = await useAsyncData(() => queryCollection('content').path('/about').first())
</script>
