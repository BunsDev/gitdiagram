import * as schema from "./schema";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { config } from "dotenv";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

config({ path: ".env" });

// Define a type that can be either Neon or Postgres database
type DrizzleDatabase =
  | NeonHttpDatabase<typeof schema>
  | PostgresJsDatabase<typeof schema>;

const connectionString =
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? undefined;
const isNeonConnection = connectionString?.includes("neon.tech");
const isDbConfigured = Boolean(connectionString);

let db: DrizzleDatabase | undefined;

if (connectionString) {
  if (isNeonConnection) {
    // Production: Use Neon HTTP connection
    const sql = neon(connectionString);
    db = drizzleNeon(sql, { schema });
  } else {
    // Local development: Use standard Postgres connection
    const client = postgres(connectionString);
    db = drizzlePostgres(client, { schema });
  }
} else {
  console.warn(
    "POSTGRES_URL or DATABASE_URL is not set. Database-dependent features will be disabled.",
  );
}

export { db, isDbConfigured };
