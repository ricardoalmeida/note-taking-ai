/** biome-ignore-all lint/performance/useTopLevelRegex: explanation */
import { expect, TEST_USER, test } from "../fixtures/auth";

test.describe("User Login", () => {
  test("should successfully login with valid credentials", async ({ page }) => {
    // First create a user
    await page.goto("/login");
    await page.getByRole("button", { name: /need an account/i }).click();
    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page).toHaveURL("/dashboard");

    // Sign out
    await page.getByRole("button", { name: TEST_USER.name }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Now test login
    await page.goto("/login");

    // Fill in login form
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);

    // Submit form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Should see user name in the header button
    await expect(
      page.getByRole("button", { name: TEST_USER.name })
    ).toBeVisible();
  });

  test("should show error with invalid email", async ({ page }) => {
    // Create user first
    await page.goto("/login");
    await page.getByRole("button", { name: /need an account/i }).click();
    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page).toHaveURL("/dashboard");
    await page.getByRole("button", { name: TEST_USER.name }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Try login with wrong email
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign in/i }).click();

    //Invalid email or password
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("should show error with invalid password", async ({ page }) => {
    // Create user first
    await page.goto("/login");
    await page.getByRole("button", { name: /need an account/i }).click();
    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page).toHaveURL("/dashboard");
    await page.getByRole("button", { name: TEST_USER.name }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Try login with wrong password
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill("WrongPassword123!");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show error message
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("should show validation error for invalid email format", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("not-an-email");
    await page.getByLabel(/password/i).fill(TEST_USER.password);

    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show validation error from Zod
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test("should show validation error for short password", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill("short");

    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show validation error
    await expect(
      page.getByText(/password must be at least 8 characters/i)
    ).toBeVisible();
  });

  test("should be able to navigate to sign up form", async ({ page }) => {
    await page.goto("/login");

    // Click sign up link
    await page.getByRole("button", { name: /need an account/i }).click();

    // Should see sign up form
    await expect(
      page.getByRole("heading", { name: /create account/i })
    ).toBeVisible();
  });
});
