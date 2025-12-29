import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, DollarSign, Calendar, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadCardProps {
  lead: any;
  onMove: (id: number, status: string) => void;
}

export function LeadCard({ lead, onMove }: LeadCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  return (
    <Card className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-l-4 border-l-pink-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-slate-900 truncate pr-2">
            {lead.nome}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onMove(lead.id, "novo")}>
                Mover para Novo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(lead.id, "contato")}>
                Mover para Contato
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(lead.id, "visita")}>
                Mover para Visita
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(lead.id, "proposta")}>
                Mover para Proposta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(lead.id, "fechamento")}>
                Mover para Fechamento
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onMove(lead.id, "perdido")}
                className="text-red-600"
              >
                Marcar como Perdido
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 text-xs text-slate-500">
          {lead.telefone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {lead.telefone}
            </div>
          )}

          {lead.valorPotencial > 0 && (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <DollarSign className="w-3 h-3" />
              {formatCurrency(lead.valorPotencial)}
            </div>
          )}

          <div className="flex items-center gap-1 pt-2 border-t border-slate-100 mt-2">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(lead.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </div>
        </div>

        <div className="mt-3 flex gap-1 flex-wrap">
          <Badge variant="secondary" className="text-[10px] h-5">
            {lead.origem}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
