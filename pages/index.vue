<template>
  <div class="flex flex-col w-full items-center">
    <IndexHero class="mb-[100px]" />
    <IndexCards />
    <IndexCTA />
    <Footer class="w-full" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
})
</script>
