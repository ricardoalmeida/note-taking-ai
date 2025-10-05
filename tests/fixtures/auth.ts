import { test as base } from "@playwright/test";
import { resetDatabase } from "../helpers/database";

export { expect } from "@playwright/test";

type AuthFixtures = {
  cleanDatabase: void;
};

/**
 * Extended test with database cleanup
 */
export const test = base.extend<AuthFixtures>({
  cleanDatabase: [
    async ({}, use) => {
      // Reset database before each test
      await resetDatabase();
      await use();
    },
    { auto: true },
  ],
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
