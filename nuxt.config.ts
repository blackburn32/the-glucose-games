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
        supabase: {
          url: 'https://robpsmulkkgavocpifbg.supabase.co',
          key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYnBzbXVsa2tnYXZvY3BpZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjI2NzcsImV4cCI6MjA1MjUzODY3N30.LkXa_vxlC4hSw_Ra7zQzKCsxpQKumv2NFosLcM77oao',
        },
      },
      supabase: {
        serviceKey: 'This is overridden by .env',
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
