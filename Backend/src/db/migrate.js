import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getDbClient } from "./index.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const migrationsDirectory = path.join(currentDirectory, "migrations");

const runMigrations = async () => {
  const client = await getDbClient();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    const appliedResult = await client.query(
      "SELECT filename FROM schema_migrations ORDER BY filename ASC",
    );
    const appliedMigrations = new Set(
      appliedResult.rows.map((migration) => migration.filename),
    );

    const migrationFiles = (await readdir(migrationsDirectory))
      .filter((filename) => filename.endsWith(".sql"))
      .sort((left, right) => left.localeCompare(right));

    for (const filename of migrationFiles) {
      if (appliedMigrations.has(filename)) {
        continue;
      }

      const filePath = path.join(migrationsDirectory, filename);
      const sql = await readFile(filePath, "utf8");

      await client.query("BEGIN");

      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [filename],
        );
        await client.query("COMMIT");
        console.log(`Applied migration: ${filename}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Database migrations are up to date.");
  } finally {
    client.release();
  }
};

runMigrations().catch((error) => {
  console.error("Database migration failed.", error);
  process.exit(1);
});
