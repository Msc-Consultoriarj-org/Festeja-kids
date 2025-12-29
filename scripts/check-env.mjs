#!/usr/bin/env node

/**
 * Script de Verificação do Ambiente Local
 * Verifica se todas as dependências e configurações estão corretas
 */

import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("\n========================================");
console.log("  FESTEJA KIDS - Verificação do Ambiente");
console.log("========================================\n");

let hasErrors = false;
let hasWarnings = false;

// Verificar Node.js
console.log("✓ Node.js:", process.version);

// Verificar arquivo .env
const envPath = join(rootDir, ".env");
if (!existsSync(envPath)) {
  console.error("✗ Arquivo .env não encontrado!");
  console.log("  Execute: copy .env.example .env");
  hasErrors = true;
} else {
  console.log("✓ Arquivo .env encontrado");

  // Verificar variáveis essenciais
  const envContent = readFileSync(envPath, "utf-8");
  const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

  for (const varName of requiredVars) {
    const regex = new RegExp(`^${varName}=(.+)$`, "m");
    const match = envContent.match(regex);

    if (!match || !match[1] || match[1].trim() === "") {
      console.warn(`  ⚠ ${varName} não configurado no .env`);
      hasWarnings = true;
    } else {
      console.log(`  ✓ ${varName} configurado`);
    }
  }
}

// Verificar node_modules
const nodeModulesPath = join(rootDir, "node_modules");
if (!existsSync(nodeModulesPath)) {
  console.error("✗ node_modules não encontrado!");
  console.log("  Execute: pnpm install");
  hasErrors = true;
} else {
  console.log("✓ node_modules encontrado");
}

// Verificar package.json
const packageJsonPath = join(rootDir, "package.json");
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  console.log("✓ package.json:", packageJson.name, packageJson.version);
} else {
  console.error("✗ package.json não encontrado!");
  hasErrors = true;
}

// Verificar estrutura de diretórios
const requiredDirs = ["client", "server", "drizzle", "scripts"];
for (const dir of requiredDirs) {
  const dirPath = join(rootDir, dir);
  if (existsSync(dirPath)) {
    console.log(`✓ Diretório ${dir}/ encontrado`);
  } else {
    console.error(`✗ Diretório ${dir}/ não encontrado!`);
    hasErrors = true;
  }
}

// Resumo
console.log("\n========================================");
if (hasErrors) {
  console.log("❌ Verificação falhou! Corrija os erros acima.");
  process.exit(1);
} else if (hasWarnings) {
  console.log("⚠️  Verificação concluída com avisos.");
  console.log("   Configure as variáveis de ambiente no .env");
  process.exit(0);
} else {
  console.log("✅ Ambiente configurado corretamente!");
  console.log("\nPróximos passos:");
  console.log("  1. pnpm db:push  (criar banco de dados)");
  console.log("  2. pnpm dev      (iniciar servidor)");
  process.exit(0);
}
