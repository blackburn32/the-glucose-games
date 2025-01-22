<template>
  <section class="relative">
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pt-32 md:pt-40 prose">
        <div class="max-w-3xl mx-auto text-center">
          <h1
            class="text-6xl font-hkgrotesk mb-6"
            data-aos="fade-up"
          >
            The Glucose Games
          </h1>
          <p
            class="text-xl mb-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Games you control with your blood glucose. Improve your control, get healthy, and have fun!
          </p>
          <div
            class="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4 not-prose"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div>
              <NuxtLink
                class="btn btn-primary w-full shadow-sm group"
                to="/login"
              >
                Get Started Free <span class="tracking-normal group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
              </NuxtLink>
            </div>
            <div>
              <NuxtLink
                class="btn btn-outline w-full shadow-sm"
                to="/about"
              >Learn More</NuxtLink>
            </div>
          </div>
        </div>

        <div
          class="pt-4 md:pt-10 px-4zs"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <NuxtImg
            class="mx-auto md:max-w-xl"
            src="https://robpsmulkkgavocpifbg.supabase.co/storage/v1/object/public/images/glucoseGamesLogoLarge2.png?t=2025-01-20T18%3A33%3A22.087Z"
            height="2856"
            width="2869"
            alt="The Glucose Games Logo"
          />
        </div>
      </div>
    </div>
  </section>
</template>
