<template>
  <div>
    <div class="text-xl underline w-full md:max-w-xl mt-3">
      Glucose Display Unit
    </div>
    <div class="flex flex-row space-x-2 items-center w-full md:max-w-xl mt-2">
      <input
        v-model="useMmol"
        type="checkbox"
        class="toggle"
      >
      <div class="text-lg">
        {{ unit }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { useMmol, unit } = useDisplaySettings()
</script>
