import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@morev/vue-transitions/nuxt', '@nuxt/test-utils/module', '@nuxtjs/supabase', '@nuxt/ui-pro', '@nuxt/eslint', '@nuxthub/core', '@nuxt/content', '@nuxt/image', '@samk-dev/nuxt-vcalendar', '@sentry/nuxt/module'],

  $production: {
    runtimeConfig: {
      public: {
        authCallbackUrl: 'https://glucose.games/current',
        supabase: {
          url: 'https://robpsmulkkgavocpifbg.supabase.co',
          key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYnBzbXVsa2tnYXZvY3BpZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5Nzg5NjYsImV4cCI6MjA1MjU1NDk2Nn0.EMfcKeCxgwVdTqDDt67BNADc82ZMNKLpaJRVK_uo-mA',
        },
      },
      supabase: {
        serviceKey: 'This is overridden by .env',
      },
    },
  },

  ssr: false,

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  app: {
    head: {
      title: 'The Glucose Games',
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: 'The games you play with your blood glucose' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'https://glucose.games/favicon.png' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },

  runtimeConfig: {
    public: {
      authCallbackUrl: 'http://localhost:3000/current',
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'Document-Policy': 'js-profiling',
      },
    },
  },

  sourcemap: {
    client: 'hidden',
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    preset: 'cloudflare-pages',
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    test: {
      coverage: {
        reporter: ['json', 'json-summary'],
        reportOnFailure: true,
      },
    },
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
      callback: '/current',
      exclude: [
        '/about/*',
        '/account',
        '/current',
        '/history',
        '/achievements',
        '/login',
        '/',
      ],
      saveRedirectToCookie: true,
    },
  },
})
