import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: 'https://550b0b2aff9c81090aa5cf68cd787d3f@o4508887036526592.ingest.us.sentry.io/4508887038033920',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
  debug: false,
  environment: process.env.SENTRY_ENVIRONMENT,
})
