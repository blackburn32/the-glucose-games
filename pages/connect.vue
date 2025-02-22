<template>
  <div class="flex flex-col w-full items-center space-y-4 min-h-[calc(100vh-248px)]">
    <div class="text-4xl font-bold mt-10">
      Connect to your data
    </div>
    <NightscoutConnector class="max-w-xl" />
    <DexcomConnector class="max-w-xl" />
  </div>
</template>

<script setup lang="ts">
</script>
