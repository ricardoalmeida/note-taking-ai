# E2E Tests

End-to-end tests for the ricardoalmeida-dubai project using Playwright and Bun's built-in test runner.

## Prerequisites

1. **Make sure the server is running** on `http://localhost:3000`
   ```bash
   bun run dev:server
   ```

2. Install dependencies: `bun install` (from root directory)

3. Install Playwright browsers: `npx playwright install`

## Running Tests

### Method 1: From Root Directory (Recommended)

```bash
bun run test:e2e

# Run tests in UI mode for debugging
bun run test:e2e -- --ui

# Run tests in headed mode
bun run test:e2e -- --headed
```

### Method 2: Direct Execution from E2E Directory

```bash
cd tests/e2e

# Run tests normally (headless)
bun test

# Run tests in UI mode for debugging
bun test -- --ui

# Run tests in headed mode
bun test -- --headed

# Run specific test file
bun test healthcheck.test.ts

# Run tests in watch mode
bun test --watch
```

### Method 3: Using Turbo Directly

```bash
# Run E2E tests via Turborepo
bunx turbo -F e2e test

# Debug mode
bunx turbo -F e2e test -- --ui
```


## Test Structure

- `*.test.ts` - Individual test files using Playwright's test runner
- `screenshots/` - Screenshots captured during test runs

## Troubleshooting

### "Script not found" Error
If you get a script not found error, try:
1. Run `bun install` from the root directory
2. Use Method 2 (direct execution) as an alternative

### Test Timeout
If tests timeout:
1. Ensure the server is running: `bun run dev:server`
2. Check that `http://localhost:3000` is accessible
3. Increase timeout values in test files if needed

### Browser Issues
For browser-related issues:
- Run in UI mode: `bun test -- --ui`
- Check screenshots in the `test-results/` directory
- Ensure you have the browsers installed: `npx playwright install`

## Current Tests

### healthcheck.test.ts

Tests the oRPC healthCheck endpoint through the API interface:
1. Navigates to `http://localhost:3000/rpc/api#tag/default/post/healthCheck`
2. Clicks the "Test Request" button for `/healthCheck`
3. Clicks the "Send" button
4. Validates that the response status is 200 OK

## Adding New Tests

1. Create new `*.test.ts` file in this directory
2. Import test functions from `bun:test`:
   ```typescript
import { test, expect, describe } from '@playwright/test';
   ```
4. Follow the existing pattern for browser automation
5. Add proper error handling and screenshots for debugging

## Playwright Test Features Used

- **test**: Define individual test cases
- **expect**: Assertions and matchers
- **page**: The page object to interact with the browser
