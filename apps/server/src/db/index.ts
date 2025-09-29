import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as auth from './schema/auth';
import * as notes from './schema/notes';
import * as notes from "./schema/notes";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./local.db",
});

export const db = drizzle({ client, schema: { ...auth, ...notes } });

export { auth, notes };
