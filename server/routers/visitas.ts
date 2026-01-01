import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { visitas, festas } from "../../drizzle/schema";
import { eq, and, gte, lte, desc, not } from "drizzle-orm";
import { getDb } from "../db";

export const visitasRouter = router({
  // Criar agendamento (Público)
  create: publicProcedure
    .input(
      z.object({
        clienteNome: z.string().min(3),
        clienteTelefone: z.string().min(8),
        dataAgendamento: z.string().transform(str => new Date(str)),
        tipoEvento: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

            // Verificar disponibilidade (Regra de negócio simples: não pode haver outra visita no mesmo horário)
            // Verificar conflito com outras visitas
            const existingVisita = await db.select().from(visitas).where(
                and(
                    eq(visitas.dataAgendamento, input.dataAgendamento),
                    eq(visitas.status, "agendada")
                )
            );

            if (existingVisita.length > 0) {
                throw new Error("Horário indisponível");
            }

            // Verificar conflito com festas
            const existingFesta = await db.select().from(festas).where(
                and(
                    eq(festas.dataFesta, input.dataAgendamento),
                    not(eq(festas.status, "cancelada"))
                )
            );

            if (existingFesta.length > 0) {
                throw new Error("Horário indisponível");
            }

      await db.insert(visitas).values({
        clienteNome: input.clienteNome,
        clienteTelefone: input.clienteTelefone,
        dataAgendamento: input.dataAgendamento,
        tipoEvento: input.tipoEvento,
        observacoes: input.observacoes,
        status: "agendada",
      });

      return { success: true };
    }),

  // Listar horários ocupados (Público - para o calendário)
  getBusySlots: publicProcedure
    .input(
      z.object({
        start: z.string().transform(str => new Date(str)),
        end: z.string().transform(str => new Date(str)),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const slots = await db
        .select({
          dataAgendamento: visitas.dataAgendamento,
        })
        .from(visitas)
        .where(
          and(
            gte(visitas.dataAgendamento, input.start),
            lte(visitas.dataAgendamento, input.end),
            eq(visitas.status, "agendada")
          )
        );

      return slots.map(s => s.dataAgendamento);
    }),

  // Listar todas as visitas (Admin)
  list: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(visitas).orderBy(desc(visitas.dataAgendamento));
  }),

  // Atualizar status (Admin)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["agendada", "realizada", "cancelada", "noshow"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(visitas)
        .set({ status: input.status })
        .where(eq(visitas.id, input.id));
    }),
});
