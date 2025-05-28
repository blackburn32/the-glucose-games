<template>
  <div class="flex flex-col w-full max-w-[1440px] items-center mx-auto">
    <IndexHero class="mb-[40px]" />
    <IndexCards />
    <IndexCTA />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'The Glucose Games',
  layout: 'marketing',
})
useSeoMeta({
  title: 'The Glucose Games',
  titleTemplate: '%s',
  description: 'The games you play with your blood glucose!',
})
</script>
