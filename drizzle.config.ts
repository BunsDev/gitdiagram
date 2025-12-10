import { type Config } from "drizzle-kit";

import { env } from "~/env";

const databaseUrl =
  env.POSTGRES_URL ??
  env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:password@localhost:5432/gitdiagram";

if (!env.POSTGRES_URL && !env.DATABASE_URL) {
  console.warn(
    "Database URL not set. Falling back to a local placeholder connection string.",
  );
}

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: ["gitdiagram_*"],
} satisfies Config;
