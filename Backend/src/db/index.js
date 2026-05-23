import pg from "pg";

import { env } from "../config/env.js";

const { Pool } = pg;

const connectionOptions = {
  connectionString: env.databaseUrl,
};

if (env.databaseSsl) {
  connectionOptions.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(connectionOptions);

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL client error.", error);
});

export const connectDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("PostgreSQL connection established.");
  } finally {
    client.release();
  }
};

export const disconnectDatabase = async () => {
  await pool.end();
};

export const query = (text, params = []) => pool.query(text, params);

export const getDbClient = () => pool.connect();
