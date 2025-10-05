/** biome-ignore-all lint/suspicious/noConfusingVoidType: explanation */
/** biome-ignore-all lint/correctness/noUnusedImports: explanation */
import { test as base, type expect } from "@playwright/test";
import { resetDatabase } from "../helpers/database";

// biome-ignore lint/performance/noBarrelFile: explanation
export { expect } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: void;
};

/**
 * Extended test with database cleanup
 */
export const test = base.extend<AuthFixtures>({});

test.beforeEach(async () => {
  // Reset database before each test
  await resetDatabase();
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
