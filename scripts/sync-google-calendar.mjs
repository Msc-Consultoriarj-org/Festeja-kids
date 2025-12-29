import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, gte, lte } from "drizzle-orm";
import { festas, clientes } from "../drizzle/schema.ts";
import { execSync } from "child_process";

const db = drizzle(process.env.DATABASE_URL);

// Buscar festas de janeiro de 2026
const inicioJaneiro = new Date("2026-01-01").getTime();
const fimJaneiro = new Date("2026-01-31T23:59:59").getTime();

console.log("Buscando festas de janeiro de 2026...");

const festasJaneiro = await db
  .select({
    id: festas.id,
    codigo: festas.codigo,
    clienteNome: clientes.nome,
    dataFesta: festas.dataFesta,
    horario: festas.horario,
    tema: festas.tema,
    numeroConvidados: festas.numeroConvidados,
    valorTotal: festas.valorTotal,
  })
  .from(festas)
  .leftJoin(clientes, eq(festas.clienteId, clientes.id))
  .where(
    and(
      gte(festas.dataFesta, new Date(inicioJaneiro)),
      lte(festas.dataFesta, new Date(fimJaneiro))
    )
  );

console.log(`Encontradas ${festasJaneiro.length} festas em janeiro de 2026`);

if (festasJaneiro.length === 0) {
  console.log("Nenhuma festa para sincronizar.");
  process.exit(0);
}

// Preparar eventos para o Google Calendar
const eventos = festasJaneiro.map(festa => {
  const dataFesta = new Date(festa.dataFesta);
  const dataFormatada = dataFesta.toISOString().split("T")[0]; // YYYY-MM-DD

  // Se tem horário, usar como evento com hora específica
  let startTime, endTime;
  if (festa.horario) {
    // Extrair hora de início do horário (ex: "15h às 19h" -> "15:00")
    const horaMatch = festa.horario.match(/(\d{1,2})h/);
    if (horaMatch) {
      const hora = horaMatch[1].padStart(2, "0");
      startTime = `${dataFormatada}T${hora}:00:00-03:00`; // Timezone BRT
      endTime = `${dataFormatada}T${hora}:00:00-03:00`; // Mesmo horário, Google Calendar ajusta
    } else {
      // Sem horário específico, evento de dia inteiro
      startTime = dataFormatada;
      endTime = dataFormatada;
    }
  } else {
    // Evento de dia inteiro
    startTime = dataFormatada;
    endTime = dataFormatada;
  }

  const descricao = [
    `Código: ${festa.codigo}`,
    `Cliente: ${festa.clienteNome || "N/A"}`,
    `Convidados: ${festa.numeroConvidados || "N/A"}`,
    `Tema: ${festa.tema || "N/A"}`,
    `Valor: R$ ${(festa.valorTotal / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  ].join("\\n");

  return {
    summary: `🎉 Festa - ${festa.clienteNome || festa.codigo}`,
    description: descricao,
    start_time: startTime,
    end_time: endTime,
    location: "Festeja Kids",
    reminders: [60, 1440], // 1 hora e 1 dia antes
  };
});

// Criar JSON para o MCP
const eventsJson = JSON.stringify({ events: eventos });

console.log(`\\nCriando ${eventos.length} eventos no Google Calendar...`);

try {
  const result = execSync(
    `manus-mcp-cli tool call google_calendar_create_events --server google-calendar --input '${eventsJson}'`,
    { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
  );

  console.log("\\n✅ Eventos criados com sucesso!");
  console.log(result);
} catch (error) {
  console.error("❌ Erro ao criar eventos:", error.message);
  process.exit(1);
}
