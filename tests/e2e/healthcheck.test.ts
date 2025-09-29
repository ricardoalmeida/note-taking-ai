import { test, expect } from '@playwright/test';

test.describe('HealthCheck API E2E Test', () => {
  test('should test healthCheck endpoint via oRPC API interface', async ({ page }) => {
    // Navigate to the oRPC API interface
    await page.goto('http://localhost:3000/rpc/api#tag/default/post/healthCheck', {
      waitUntil: 'networkidle',
    });

    // Click the "Test Request" button
    await page.getByRole('button', { name: 'Test Request (post /healthCheck)' }).click();

    // Click the "Send" button
    await page.getByRole('button', { name: 'Send Request ⌘ Command ↵ Enter' }).click();

    // Wait for the response and verify its status
    const response = await page.waitForResponse(resp => resp.url().includes('/healthCheck') && resp.status() === 200);

    expect(response.ok()).toBe(true);
  });
});
