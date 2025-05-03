<template>
  <div class="flex flex-col w-full space-y-4 md:space-y-0 md:flex-row md:space-x-8">
    <div class="card bg-primary w-full md:w-1/3">
      <div class="card-body p-[32px]">
        <div class="card-title text-primary-content text-xl font-semibold">
          Connect your data
        </div>
        <div class="text-primary-content text-lg">
          Glucose Games are powered by your continuous glucose monitor data so they’re always up-to-date.
        </div>
      </div>
      <figure>
        <IndexCardsNumberLines
          :numbers="[62, 270, 96, 56, 250, 360, 70, 150]"
        />
      </figure>
    </div>
    <div class="card bg-primary w-full md:w-1/3">
      <div class="card-body p-[32px]">
        <div class="card-title text-primary-content text-xl font-semibold">
          Play the games
        </div>
        <div class="text-primary-content text-lg">
          Control the games by keeping your blood glucose in range.
          Try to beat your high scores!
        </div>
      </div>
      <figure>
        <IndexCardsLineGraph />
      </figure>
    </div>
    <div class="card bg-primary w-full md:w-1/3">
      <div class="card-body p-[32px]">
        <div class="card-title text-primary-content text-xl font-semibold">
          Improve your control
        </div>
        <div class="text-primary-content text-lg">
          Keep track of your longest streaks and see how you're improving over time.
          Discover where you need to focus to improve your control.
        </div>
      </div>
      <figure class="w-full h-full">
        <IndexCardsDailyStreaks />
      </figure>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
