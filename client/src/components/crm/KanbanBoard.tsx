import React from "react";
import { LeadCard } from "./LeadCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanBoardProps {
  leads: any[];
  onMoveLead: (id: number, status: string) => void;
}

const COLUMNS = [
  { id: "novo", title: "Novo Lead", color: "bg-blue-50 border-blue-200" },
  {
    id: "contato",
    title: "Em Contato",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "visita",
    title: "Visita Agendada",
    color: "bg-purple-50 border-purple-200",
  },
  {
    id: "proposta",
    title: "Proposta Enviada",
    color: "bg-orange-50 border-orange-200",
  },
  {
    id: "fechamento",
    title: "Fechamento",
    color: "bg-green-50 border-green-200",
  },
];

export function KanbanBoard({ leads, onMoveLead }: KanbanBoardProps) {
  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.statusFunil === status);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
      {COLUMNS.map(col => {
        const colLeads = getLeadsByStatus(col.id);
        const totalValue = colLeads.reduce(
          (sum, lead) => sum + (lead.valorPotencial || 0),
          0
        );

        return (
          <div
            key={col.id}
            className={`min-w-[280px] w-[280px] flex flex-col rounded-xl border ${col.color} h-full`}
          >
            <div className="p-3 border-b border-slate-200/50 bg-white/50 rounded-t-xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-slate-700">{col.title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                  {colLeads.length}
                </span>
              </div>
              {totalValue > 0 && (
                <div className="text-xs text-slate-500 font-medium">
                  Potencial:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalValue / 100)}
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {colLeads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} onMove={onMoveLead} />
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
