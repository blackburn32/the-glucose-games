<template>
  <div class="flex flex-row space-x-4 items-center mt-[10px]">
    <div class="flex flex-row space-x-1 items-center">
      <div class="bg-success rounded-full w-4 h-4" />
      <div class="text-xs text-neutral-content">
        In Range
      </div>
    </div>
    <div class="flex flex-row space-x-1 items-center">
      <div class="bg-warning rounded-full w-4 h-4" />
      <div class="text-xs text-neutral-content">
        Almost in Range
      </div>
    </div>
    <div class="flex flex-row space-x-1 items-center">
      <div class="bg-error rounded-full w-4 h-4" />
      <div class="text-xs text-neutral-content">
        Out of Range
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or special behavior needed
</script>
