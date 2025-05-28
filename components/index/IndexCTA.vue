<template>
  <section class="relative w-full">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="py-12 md:py-20">
        <div
          class="max-w-3xl mx-auto text-center pb-[24px]"
        >
          <div class="text-2xl md:text-4xl">
            Join the open beta!
          </div>
        </div>

        <div class="flex flex-row items-center justify-center space-x-4">
          <NuxtLink
            class="btn btn-primary shadow-sm"
            to="/signUp"
          >Get started</NuxtLink>
          <NuxtLink
            class="btn shadow-sm group"
            to="/dashboard"
          >
            Check out the games
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
