<template>
  <DashboardPanelWithHeader
    id="current"
    title="Current Games"
  >
    <div class="flex flex-col w-full items-center space-y-4 px-2">
      <div class="text-4xl font-bold mt-10">
        Loading...
      </div>
    </div>
  </DashboardPanelWithHeader>
</template>

<script setup lang="ts">
onMounted(() => {
  navigateTo('/dashboard')
})
</script>
