<template>
  <div class="flex flex-col w-full space-y-4 md:space-y-0 md:flex-row md:space-x-8 px-[40px]">
    <div class="card bg-primary w-full md:w-1/3">
      <div class="card-body ">
        <div class="card-title text-secondary-content">
          Connect your data
        </div>
        <div class="text-secondary-content">
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
      <div class="card-body ">
        <div class="card-title text-secondary-content">
          Play the games
        </div>
        <div class="text-secondary-content">
          Control the games by keeping your blood glucose in range.
          Try to beat your high scores!
        </div>
      </div>
      <figure>
        <IndexCardsLineGraph />
      </figure>
    </div>
    <div class="card bg-primary w-full md:w-1/3">
      <div class="card-body">
        <div class="card-title text-secondary-content">
          Improve your control
        </div>
        <div class="text-secondary-content">
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
