/** biome-ignore-all lint/performance/useTopLevelRegex: <explanation> */
import { expect, TEST_USER, test } from "../fixtures/auth";

test.describe("User Logout", () => {
  test.beforeEach(async ({ page }) => {
    // Create and login a test user
    await page.goto("/login");
    await page.getByRole("button", { name: /need an account/i }).click();
    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("should successfully logout from dashboard", async ({ page }) => {
    // User should be logged in
    await expect(page.getByText(TEST_USER.name)).toBeVisible();

    // Click user menu
    await page.getByRole("button", { name: TEST_USER.name }).click();

    // Click sign out
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL("/");

    // Should see "Sign In" button instead of user menu
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("should clear session after logout", async ({ page }) => {
    // Logout
    await page.getByRole("button", { name: TEST_USER.name }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Try to access dashboard
    await page.goto("/dashboard");

    // Should redirect to login or show authentication required
    // This depends on your auth setup, adjust accordingly
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("should be able to login again after logout", async ({ page }) => {
    // Logout
    await page.getByRole("button", { name: TEST_USER.name }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Login again
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should successfully login
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText(TEST_USER.name)).toBeVisible();
  });

  test("should logout from any page", async ({ page }) => {
    // Navigate to AI chat page
    await page.goto("/ai");

    // User should still be logged in
    await expect(page.getByText(TEST_USER.name)).toBeVisible();

    // Logout from AI page
    await page.getByRole("button", { name: TEST_USER.name }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Should redirect to home
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("should show logout option in user menu", async ({ page }) => {
    // Click user menu
    await page.getByRole("button", { name: TEST_USER.name }).click();

    // Should see user email
    await expect(page.getByText(TEST_USER.email)).toBeVisible();

    // Should see sign out option
    await expect(
      page.getByRole("menuitem", { name: /sign out/i })
    ).toBeVisible();
  });
});
