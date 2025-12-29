import { drizzle } from "drizzle-orm/mysql2";
import { clientes, festas, pagamentos } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

console.log("📊 Importação completa com pagamentos detalhados...\n");

// Ler JSON convertido
const festasData = JSON.parse(
  readFileSync(
    "/home/ubuntu/festeja-kids-2/scripts/proximasfestas-complete.json",
    "utf-8"
  )
);

console.log(`📋 ${festasData.length} festas para processar\n`);

let pagamentosImportados = 0;

for (const festaData of festasData) {
  const { codigo, cliente, pagamento1, pagamento2, pagamento3 } = festaData;

  if (!codigo) continue;

  // Buscar festa pelo código
  const festaResult = await db
    .select()
    .from(festas)
    .where(eq(festas.codigo, codigo))
    .limit(1);

  if (festaResult.length === 0) {
    console.log(`⚠️  Festa não encontrada: ${codigo}`);
    continue;
  }

  const festa = festaResult[0];

  // Inserir pagamentos
  const pagamentosArray = [
    { valor: pagamento1, ordem: 1 },
    { valor: pagamento2, ordem: 2 },
    { valor: pagamento3, ordem: 3 },
  ];

  for (const pag of pagamentosArray) {
    if (pag.valor && pag.valor > 0) {
      try {
        await db.insert(pagamentos).values({
          festaId: festa.id,
          valor: Math.round(pag.valor * 100), // Converter para centavos
          dataPagamento: new Date(), // Usar data atual como padrão
          metodoPagamento: null,
          observacoes: `Parcela ${pag.ordem}`,
        });
        pagamentosImportados++;
      } catch (e) {
        console.log(`❌ Erro ao importar pagamento: ${e.message}`);
      }
    }
  }

  console.log(`✅ ${cliente} - ${pagamentosImportados} pagamentos`);
}

console.log(`\n📊 Resumo:`);
console.log(`✅ ${pagamentosImportados} pagamentos importados`);
console.log(`\n🎉 Importação concluída!`);

process.exit(0);
