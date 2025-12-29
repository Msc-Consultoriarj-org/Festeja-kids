#!/usr/bin/env node

/**
 * Script de Inicialização Rápida do Banco de Dados
 * Cria o banco e importa dados de exemplo (se disponíveis)
 */

import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("\n========================================");
console.log("  FESTEJA KIDS - Inicialização do Banco");
console.log("========================================\n");

// Verificar .env
const envPath = join(rootDir, ".env");
if (!existsSync(envPath)) {
  console.error("❌ Arquivo .env não encontrado!");
  console.log("Execute primeiro: copy .env.example .env");
  process.exit(1);
}

try {
  // Executar migrações
  console.log("📦 Criando estrutura do banco de dados...\n");
  execSync("pnpm db:push", {
    cwd: rootDir,
    stdio: "inherit",
    shell: true,
  });

  console.log("\n✅ Banco de dados criado com sucesso!\n");

  // Verificar se há dados para importar
  const importScript = join(rootDir, "scripts", "import-complete.mjs");
  if (existsSync(importScript)) {
    console.log("📊 Deseja importar dados de exemplo? (s/n)");
    // Para automação, pular importação por padrão
    console.log("   (Execute manualmente: node scripts/import-complete.mjs)\n");
  }

  console.log("========================================");
  console.log("  Próximo passo: pnpm dev");
  console.log("========================================\n");
} catch (error) {
  console.error("\n❌ Erro ao criar banco de dados:", error.message);
  process.exit(1);
}
