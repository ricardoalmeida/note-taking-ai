/** biome-ignore-all lint/performance/useTopLevelRegex: Allow literals in e2e tests */
import { expect, TEST_USER, TEST_USER_2, test } from "../fixtures/auth";

test.describe("User Registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should successfully register a new user", async ({ page }) => {
    // Click "Sign Up" link to switch to registration form
    await page.getByRole("button", { name: /need an account/i }).click();

    // Fill in registration form
    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);

    // Submit form
    await page.getByRole("button", { name: /sign up/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Should see user name in the menu
    await expect(page.getByText(TEST_USER.name)).toBeVisible();
  });

  test("should show validation error for short password", async ({ page }) => {
    await page.getByRole("button", { name: /need an account/i }).click();

    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill("short");

    await page.getByRole("button", { name: /sign up/i }).click();

    // Should show validation error
    await expect(
      page.getByText(/password must be at least 8 characters/i)
    ).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.getByRole("button", { name: /need an account/i }).click();

    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/password/i).fill(TEST_USER.password);

    await page.getByRole("button", { name: /sign up/i }).click();

    // Should show validation error
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test("should show error when registering with existing email", async ({
    page,
  }) => {
    // First registration
    await page.getByRole("button", { name: /need an account/i }).click();
    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign up/i }).click();

    // Wait for redirect
    await expect(page).toHaveURL("/dashboard");

    // Sign out
    await page.getByRole("button", { name: TEST_USER.name }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Try to register again with same email
    await page.goto("/login");
    await page.getByRole("button", { name: /need an account/i }).click();
    await page.getByLabel(/name/i).fill(TEST_USER_2.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER_2.password);
    await page.getByRole("button", { name: /sign up/i }).click();

    // Should show error message
    await expect(page.getByText(/email.*already/i)).toBeVisible();
  });

  test("should be able to switch to sign in form", async ({ page }) => {
    await page.getByRole("button", { name: /need an account/i }).click();

    // Should see sign up form
    await expect(
      page.getByRole("heading", { name: /create account/i })
    ).toBeVisible();

    // Click sign in link
    await page
      .getByRole("button", { name: /already have an account/i })
      .click();

    // Should see sign in form
    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible();
  });
});
