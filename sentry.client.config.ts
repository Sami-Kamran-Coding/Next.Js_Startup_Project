import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7cd9eb2c9c76ed7f94bdfb21b700e862@o4509718562013184.ingest.us.sentry.io/4509718564175872",
  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],
});