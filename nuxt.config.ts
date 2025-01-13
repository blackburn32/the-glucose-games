// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxthub/core',
    '@nuxt/content',
  ],

  $production: {
    runtimeConfig: {
      public: {
        authCallbackUrl: 'https://glucose.games/confirm',
      },
      dexcomBaseUrl: 'https://sandbox-api.dexcom.com',
      dexcomRedirectUrl: 'http://glucose.games/api/authorize/dexcom',
    },
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'The Glucose Games',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: 'The only games you play with your blood glucose' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      authCallbackUrl: 'http://localhost:3000/confirm',
    },
    dexcomBaseUrl: 'https://sandbox-api.dexcom.com',
    dexcomClientId: 'This is overridden by .env',
    dexcomClientSecret: 'This is overridden by .env',
    dexcomRedirectUrl: 'http://localhost:3000/api/authorize/dexcom',
  },
  compatibilityDate: '2024-11-01',

  nitro: {
    preset: 'cloudflare-pages',
    // experimental: {
    //   openAPI: true,
    // },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [
        '/about',
        '/confirm',
        '/login',
        '/privacy',
        '/tos',
        '/',
      ],
      cookieRedirect: true,
    },
  },
})
