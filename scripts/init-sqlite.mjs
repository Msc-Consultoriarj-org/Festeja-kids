import Database from "better-sqlite3";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ler DATABASE_URL do .env
const envPath = join(__dirname, "../.env");
const envContent = readFileSync(envPath, "utf-8");
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);

if (!dbUrlMatch) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

const dbUrl = dbUrlMatch[1].trim();

if (!dbUrl.startsWith("file:")) {
  console.log(
    "ℹ️  DATABASE_URL is not SQLite (file:), skipping SQLite initialization"
  );
  console.log("   For MySQL, use: pnpm db:push");
  process.exit(0);
}

const dbPath = dbUrl.replace("file:", "");
console.log(`📦 Initializing SQLite database: ${dbPath}`);

try {
  const db = new Database(dbPath);

  // Ler e executar todas as migrações SQL
  const migrationsDir = join(__dirname, "../drizzle");
  const sqlFiles = readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  console.log(`📝 Found ${sqlFiles.length} migration files`);

  for (const file of sqlFiles) {
    console.log(`   Executing: ${file}`);
    const sqlPath = join(migrationsDir, file);
    const sql = readFileSync(sqlPath, "utf-8");

    // Dividir por statements (separados por ;)
    const statements = sql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        db.exec(statement);
      } catch (error) {
        // Ignorar erros de "table already exists"
        if (!error.message.includes("already exists")) {
          throw error;
        }
      }
    }
  }

  db.close();

  console.log("✅ Database initialized successfully!");
  console.log("");
  console.log("Next steps:");
  console.log("  1. Run: pnpm dev");
  console.log("  2. Or: iniciar.cmd");
} catch (error) {
  console.error("❌ Failed to initialize database:", error);
  process.exit(1);
}
