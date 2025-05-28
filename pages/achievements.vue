<template>
  <DashboardPanelWithHeader
    id="achievements"
    title="Achievements"
  >
    <AchievementsViewer />
  </DashboardPanelWithHeader>
</template>

<script setup lang="ts">
useHead({
  title: 'Achievements',
})
useSeoMeta({
  description: 'Track your progress and unlock achievements as you master your blood glucose management.',
})
</script>
