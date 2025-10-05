#!/bin/bash
set -e  # Exit on error

# Run the Bun script to setup test database
bun run tests/setup-test-db.ts
