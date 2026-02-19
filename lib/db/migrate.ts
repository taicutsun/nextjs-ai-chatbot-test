import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: ".env.local",
});

const runMigrate = async () => {
  const host = process.env.POSTGRES_HOST ?? "localhost";
  const port = Number(process.env.POSTGRES_PORT) || 5432;
  const user = process.env.POSTGRES_USER ?? "postgres";
  const password = process.env.POSTGRES_PASSWORD ?? "";
  const database = process.env.POSTGRES_DATABASE ?? "postgres";
  const schema = process.env.POSTGRES_SCHEMA ?? "next_test";

  if (!user || !database) {
    console.log("⏭️  Database not configured, skipping migrations");
    process.exit(0);
  }

  const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}?search_path=${schema}`;
  const connection = postgres(connectionString, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
