import * as Sentry from '@sentry/nuxt'
import dotenv from 'dotenv'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

dotenv.config()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  debug: false,
  environment: process.env.SENTRY_ENVIRONMENT,
  profileSessionSampleRate: 1.0,
  profileLifecycle: 'trace',
})
