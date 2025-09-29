import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as auth from "./schema/auth";
import * as notes from "./schema/notes";

const sqlite = new Database("sqlite.db");

export const db = drizzle(sqlite, { schema: { ...auth, ...notes } });

export { auth, notes };
