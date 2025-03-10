import * as Sentry from '@sentry/nuxt'
import dotenv from 'dotenv'

dotenv.config()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})
