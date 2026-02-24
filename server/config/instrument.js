import * as Sentry from "@sentry/node";

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN, // DSN from .env
  integrations: [
    // MongoDB integration (works with Mongoose under the hood)
    Sentry.mongoIntegration(),
  ],
  tracesSampleRate: 1.0,   // capture 100% of transactions (lower in prod)
  sendDefaultPii: true,    // captures IP, user info (optional)
  environment: process.env.NODE_ENV || "development", // helps filter in Sentry UI
});

// Capture global unhandled rejections
process.on("unhandledRejection", (reason) => {
  Sentry.captureException(reason);
  console.error("Unhandled Rejection:", reason);
});

// Capture uncaught exceptions
process.on("uncaughtException", (err) => {
  Sentry.captureException(err);
  console.error("Uncaught Exception:", err);
});

export default Sentry;
