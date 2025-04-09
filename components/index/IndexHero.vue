<template>
  <div class="flex flex-col w-full items-center">
    <div class="flex flex-col md:flex-row w-full md:space-x-8 max-w-6xl">
      <div class="flex flex-col w-full md:w-2/5">
        <div class="flex flex-col ml-[40px] mt-[160px] max-w-[400px]">
          <div class="text-7xl font-bold ">
            Glucose Games
          </div>
          <div class="mt-4">
            Games you control with your blood glucose.
          </div>
          <div>
            Improve your control, get healthy, and have fun!
          </div>
          <div class="flex flex-row space-x-4 mt-4">
            <NuxtLink
              to="/login"
              class="btn btn-primary"
            >Get started</NuxtLink>
            <NuxtLink
              to="/current"
              class="btn btn-neutral"
            >Check out the games</NuxtLink>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full md:w-3/5">
        <IndexHowTo class="mt-[80px]" />
      </div>
    </div>
  </div>
</template>
