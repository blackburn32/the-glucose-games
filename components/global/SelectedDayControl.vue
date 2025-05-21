<template>
  <UPopover :popper="{ placement: 'bottom-end' }">
    <UButton
      icon="i-heroicons-calendar-days-20-solid"
      color="neutral"
      size="xl"
      variant="ghost"
      :label="formattedSelectedDate"
      :ui="{
        base: 'min-h-[48px] rounded-md',
      }"
    />

    <template #content>
      <div class="p-[24px]">
        <UCalendar
          v-model="selectedDate"
          :max-value="todayDate"
          :is-date-unavailable="isDateDisabled"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { isBefore, isAfter } from 'date-fns'
import { today, getLocalTimeZone } from '@internationalized/date'

const { selectedDate, formattedSelectedDate } = useSelectedDate()
const todayDate = today(getLocalTimeZone())

const nuxtApp = useNuxtApp()
const glucoseValues = nuxtApp.$glucoseValues
const earliestValue = computed(() => glucoseValues.value.at(0)?.created)

const isDateDisabled = (date: DateValue) => {
  if (!earliestValue.value) {
    return false
  }
  return isBefore(date.toDate(getLocalTimeZone()), earliestValue.value) || isAfter(date.toDate(getLocalTimeZone()), todayDate.toDate(getLocalTimeZone()))
}
</script>
