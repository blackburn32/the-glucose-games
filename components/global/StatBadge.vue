<template>
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure text-secondary">
        <Icon
          v-if="icon"
          :name="icon"
          size="24"
          :class="iconColor"
        />
      </div>
      <div class="stat-title">
        {{ title }}
      </div>
      <div class="stat-value">
        {{ value }}
      </div>
      <div class="stat-desc">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string
  description: string
  icon?: string | undefined
  iconColor?: string | undefined
}>()
</script>
