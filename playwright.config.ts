import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

// Load test environment variables
config({ path: ".env.test" });

// Use ports from .env.test
const TEST_SERVER_PORT = process.env.TEST_SERVER_PORT || "4000";
const TEST_WEB_PORT = process.env.TEST_WEB_PORT || "4001";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${TEST_WEB_PORT}`,
    trace: "on-first-retry",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: "setup",
      testMatch: /global\.setup\.ts/,
    },
    {
      name: "chromium",
      testMatch: "**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],

  webServer: [
    {
      command: `cd apps/server && bun --bun next dev --turbopack -p ${TEST_SERVER_PORT}`,
      url: `http://localhost:${TEST_SERVER_PORT}`,
      reuseExistingServer: false, // Always start fresh servers for tests
      timeout: 120_000,
      env: {
        DATABASE_URL: "file:./test.db", // Relative to server's working directory (apps/server/)
        NODE_ENV: "test",
        CORS_ORIGIN: `http://localhost:${TEST_WEB_PORT}`,
      },
    },
    {
      command: `cd apps/web && bun --bun next dev --turbopack -p ${TEST_WEB_PORT}`,
      url: `http://localhost:${TEST_WEB_PORT}`,
      reuseExistingServer: false, // Always start fresh servers for tests
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_SERVER_URL: `http://localhost:${TEST_SERVER_PORT}`,
        NODE_ENV: "test",
      },
    },
  ],
});
