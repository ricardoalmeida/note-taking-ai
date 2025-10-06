# E2E Tests

End-to-end tests for the note-taking AI application using Playwright.

## Running Tests

From the root directory:

```bash
# Run all tests
bun test:e2e

# Run with UI mode
bun test:e2e:ui

# Run in headed mode (visible browser)
bun test:e2e:headed

# Run in debug mode
bun test:e2e:debug
```

## Test Structure

- `tests/auth/` - Authentication tests (login, logout, register)
- `tests/fixtures/` - Shared test fixtures and setup
- `tests/helpers/` - Helper functions for database and utilities

## Database Isolation

Tests use an isolated SQLite database (`test.db`) that is:
- Created automatically when tests run
- Cleaned before each test
- Separate from the development database (`local.db`)

The test database is configured via `DATABASE_URL` environment variable in `playwright.config.ts`.

## Test Users

Default test users are defined in `tests/fixtures/auth.ts`:

- **TEST_USER**: test@example.com / TestPassword123!
- **TEST_USER_2**: another@example.com / AnotherPassword123!
