// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/test-utils/module', '@nuxtjs/supabase', '@nuxt/ui', '@nuxt/eslint', '@nuxthub/core', '@nuxt/content', '@pinia/nuxt', '@nuxt/image', 'nuxt-aos', '@samk-dev/nuxt-vcalendar', '@sentry/nuxt/module'],

  $production: {
    runtimeConfig: {
      public: {
        authCallbackUrl: 'https://glucose.games/confirm',
        supabase: {
          url: 'https://robpsmulkkgavocpifbg.supabase.co',
          key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYnBzbXVsa2tnYXZvY3BpZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Nzg5NjYsImV4cCI6MjA1MjU1NDk2Nn0.EMfcKeCxgwVdTqDDt67BNADc82ZMNKLpaJRVK_uo-mA',
        },
      },
      supabase: {
        serviceKey: 'This is overridden by .env',
      },
      dexcomBaseUrl: 'https://sandbox-api.dexcom.com', // Will update once approved by Dexcom for limited access
      dexcomRedirectUrl: 'https://glucose.games/api/authorize/dexcom',
    },
  },

  devtools: { enabled: true },

  app: {
    head: {
      title: 'The Glucose Games',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: 'The games you play with your blood glucose' },
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

  routeRules: {
    '/historyDemo': {
      ssr: false,
    },
    '/history': {
      ssr: false,
    },
    '/current': {
      ssr: false,
    },
    '/demo': {
      ssr: false,
    },
    '/currentDemo': {
      ssr: false,
    },
    '/achievements': {
      ssr: false,
    },
    '/achievementsDemo': {
      ssr: false,
    },
  },

  sourcemap: {
    client: 'hidden',
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

  sentry: {
    sourceMapsUploadOptions: {
      org: 'the-glucose-games',
      project: 'the-glucose-games',
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [
        '/achievementsDemo',
        '/about',
        '/confirm',
        '/demo',
        '/historyDemo',
        '/login',
        '/privacy',
        '/tos',
        '/',
      ],
      cookieRedirect: true,
    },
  },
})
