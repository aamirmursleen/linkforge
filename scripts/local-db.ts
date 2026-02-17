import EmbeddedPostgres from "embedded-postgres";

const DB_PORT = 5433;
const DB_NAME = "linkforge";
const DB_USER = "postgres";
const DB_PASS = "linkforge123";

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: "./data/postgres",
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
    persistent: true,
  });

  console.log("Starting local PostgreSQL...");
  await pg.initialise();
  await pg.start();
  await pg.createDatabase(DB_NAME);

  const connStr = `postgresql://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}`;
  console.log("\nPostgreSQL is running!");
  console.log(`Connection: ${connStr}`);
  console.log("\nSet this in your .env:");
  console.log(`DATABASE_URL="${connStr}"`);
  console.log(`DIRECT_URL="${connStr}"`);
  console.log("\nPress Ctrl+C to stop the database.\n");

  // Keep running until Ctrl+C
  process.on("SIGINT", async () => {
    console.log("\nStopping PostgreSQL...");
    await pg.stop();
    process.exit(0);
  });

  // Keep alive
  setInterval(() => {}, 1000);
}

main().catch((err) => {
  console.error("Failed to start PostgreSQL:", err);
  process.exit(1);
});
