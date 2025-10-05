import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";

/**
 * Create a test database client with isolated database file
 */
export function createTestDb() {
	const client = createClient({
		url: process.env.DATABASE_URL || "file:./test.db",
	});

	return drizzle({ client });
}

/**
 * Clean up all tables in the test database
 */
export async function cleanDatabase() {
	const db = createTestDb();

	// Get all table names
	const tables = (await db.all(sql`
    SELECT name FROM sqlite_master
    WHERE type='table'
    AND name NOT LIKE 'sqlite_%'
    AND name NOT LIKE '_drizzle%'
  `)) as Array<{ name: string }>;

	// Delete all rows from each table
	for (const table of tables) {
		await db.run(sql.raw(`DELETE FROM ${table.name}`));
	}
}

/**
 * Reset database to a clean state before each test
 */
export async function resetDatabase() {
	await cleanDatabase();
}
