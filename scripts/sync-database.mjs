import { drizzle } from "drizzle-orm/mysql2";
import { clientes, festas } from "../drizzle/schema.js";
import { eq, and, gte } from "drizzle-orm";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

console.log("🔄 Iniciando sincronização com banco de dados...\n");

// Ler festas consolidadas
const festasConsolidadas = JSON.parse(
  readFileSync(
    "/home/ubuntu/festeja-kids-2/scripts/festas_consolidadas.json",
    "utf-8"
  )
);

console.log(
  `📋 ${festasConsolidadas.length} festas consolidadas para verificar\n`
);

// Buscar todas as festas futuras do banco (a partir de hoje)
const hoje = new Date();
const festasBanco = await db
  .select()
  .from(festas)
  .where(gte(festas.dataFesta, hoje));

console.log(`💾 ${festasBanco.length} festas futuras no banco de dados\n`);

// Criar mapa de festas do banco por data + nome do cliente
const festasBancoMap = new Map();
for (const festa of festasBanco) {
  // Buscar cliente
  const clienteResult = await db
    .select()
    .from(clientes)
    .where(eq(clientes.id, festa.clienteId))
    .limit(1);
  if (clienteResult.length > 0) {
    const cliente = clienteResult[0];
    const dataFesta = new Date(festa.dataFesta);
    const key = `${cliente.nome.toLowerCase().trim()}_${dataFesta.getFullYear()}${String(dataFesta.getMonth() + 1).padStart(2, "0")}${String(dataFesta.getDate()).padStart(2, "0")}`;
    festasBancoMap.set(key, {
      festa,
      cliente,
    });
  }
}

console.log("🔍 Comparando dados...\n");

let festasNovas = 0;
let festasExistentes = 0;
let festasAtualizadas = 0;
let clientesNovos = 0;

const clientesMap = new Map();

for (const festaConsolidada of festasConsolidadas) {
  const {
    nome_cliente,
    data_evento,
    valor_total,
    numero_convidados,
    tema,
    aniversariante,
  } = festaConsolidada;

  // Converter data
  const [day, month, year] = data_evento.split("/");
  const dataFestaDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  // Criar chave para comparação
  const key = `${nome_cliente.toLowerCase().trim()}_${year}${month}${day}`;

  // Verificar se festa já existe no banco
  if (festasBancoMap.has(key)) {
    const { festa, cliente } = festasBancoMap.get(key);

    // Verificar se precisa atualizar
    const updates = {};

    if (valor_total && valor_total > 0 && festa.valorTotal !== valor_total) {
      updates.valorTotal = valor_total;
    }

    if (
      numero_convidados &&
      numero_convidados > 0 &&
      festa.numeroConvidados !== numero_convidados
    ) {
      updates.numeroConvidados = numero_convidados;
    }

    if (tema && tema.trim() && !festa.tema) {
      updates.tema = tema.trim();
    }

    if (aniversariante && aniversariante.trim() && !festa.observacoes) {
      updates.observacoes = `Aniversariante: ${aniversariante.trim()}`;
    }

    if (Object.keys(updates).length > 0) {
      await db.update(festas).set(updates).where(eq(festas.id, festa.id));
      festasAtualizadas++;
      console.log(`✏️  Atualizada: ${nome_cliente} - ${data_evento}`);
    } else {
      festasExistentes++;
    }
  } else {
    // Festa não existe, precisa criar

    // Verificar se cliente existe
    let clienteId = clientesMap.get(nome_cliente.toLowerCase().trim());

    if (!clienteId) {
      const clienteResult = await db
        .select()
        .from(clientes)
        .where(eq(clientes.nome, nome_cliente))
        .limit(1);

      if (clienteResult.length > 0) {
        clienteId = clienteResult[0].id;
        clientesMap.set(nome_cliente.toLowerCase().trim(), clienteId);
      } else {
        // Criar novo cliente
        const result = await db.insert(clientes).values({
          nome: nome_cliente,
          telefone: null,
          email: null,
          cpf: null,
          endereco: null,
        });
        clienteId = Number(result[0].insertId);
        clientesMap.set(nome_cliente.toLowerCase().trim(), clienteId);
        clientesNovos++;
      }
    }

    // Gerar código do contrato
    const dataFechamento = new Date(); // Usar data atual como fechamento
    const dayCode = String(dataFechamento.getDate()).padStart(2, "0");
    const monthCode = String(dataFechamento.getMonth() + 1).padStart(2, "0");
    const yearCode = String(dataFechamento.getFullYear()).slice(-2);
    const initials = nome_cliente
      .trim()
      .slice(0, 2)
      .toUpperCase()
      .replace(/[^A-Z]/g, "XX");
    let codigo = `${dayCode}${monthCode}${yearCode}${initials}`;

    // Verificar duplicatas
    let suffix = 1;
    let codigoOriginal = codigo;
    while (true) {
      const existing = await db
        .select()
        .from(festas)
        .where(eq(festas.codigo, codigo))
        .limit(1);
      if (existing.length === 0) break;
      codigo = `${codigoOriginal}${suffix}`;
      suffix++;
    }

    // Criar festa
    try {
      await db.insert(festas).values({
        codigo,
        clienteId,
        dataFechamento: dataFechamento,
        dataFesta: dataFestaDate,
        valorTotal: valor_total || 0,
        valorPago: 0,
        numeroConvidados: numero_convidados || 0,
        tema: tema || null,
        horario: null,
        status: dataFestaDate < hoje ? "realizada" : "agendada",
        observacoes: aniversariante
          ? `Aniversariante: ${aniversariante}`
          : null,
      });
      festasNovas++;
      console.log(`✅ Importada: ${nome_cliente} - ${data_evento}`);
    } catch (e) {
      console.log(`❌ Erro ao importar ${nome_cliente}: ${e.message}`);
    }
  }
}

console.log(`\n📊 Resumo da sincronização:`);
console.log(`✅ ${festasNovas} novas festas importadas`);
console.log(`✏️  ${festasAtualizadas} festas atualizadas`);
console.log(`ℹ️  ${festasExistentes} festas já existentes (sem alterações)`);
console.log(`👥 ${clientesNovos} novos clientes criados`);
console.log(`\n🎉 Sincronização concluída!`);

process.exit(0);
