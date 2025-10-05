import { test as base, expect } from "@playwright/test";
import { resetDatabase } from "../helpers/database";

// biome-ignore lint/performance/noBarrelFile: explanation
export { expect } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: typeof expect.soft;
};

/**
 * Extended test with database cleanup
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async (_, use) => {
    // Reset database before each test
    await resetDatabase();
    await use(expect.soft);
  },
});

/**
 * Test user credentials
 */
export const TEST_USER = {
  name: "Test User",
  email: "test@example.com",
  password: "TestPassword123!",
};

export const TEST_USER_2 = {
  name: "Another User",
  email: "another@example.com",
  password: "AnotherPassword123!",
};
