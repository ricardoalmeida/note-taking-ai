import { execSync } from "node:child_process";
import { test as setup } from "@playwright/test";

setup("setup test database", () => {
  process.stdout.write("Setting up test database...\n");

  try {
    // Run the Bun-based setup script
    execSync("bash tests/setup-db.sh", {
      stdio: "inherit",
    });

    process.stdout.write("Test database setup complete!\n");
  } catch (error) {
    process.stderr.write(
      `Failed to setup test database: ${error instanceof Error ? error.message : String(error)}\n`
    );
    throw error;
  }
});
