import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://550b0b2aff9c81090aa5cf68cd787d3f@o4508887036526592.ingest.us.sentry.io/4508887038033920",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
