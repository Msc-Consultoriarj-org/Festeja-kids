import React from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function AdminAgendamentos() {
  const utils = trpc.useContext();
  const { data: visitas, isLoading } = trpc.visitas.list.useQuery();

  const updateStatusMutation = trpc.visitas.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso");
      utils.visitas.list.invalidate();
    },
    onError: error => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  const handleStatusChange = (
    id: number,
    status: "realizada" | "cancelada" | "noshow"
  ) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendada":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Agendada
          </Badge>
        );
      case "realizada":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Realizada
          </Badge>
        );
      case "cancelada":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelada
          </Badge>
        );
      case "noshow":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            Não Compareceu
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando agendamentos...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestão de Visitas
            </h1>
            <p className="text-slate-500">
              Acompanhe e gerencie as visitas agendadas ao salão.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {visitas?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-slate-500">
                Nenhuma visita agendada encontrada.
              </CardContent>
            </Card>
          ) : (
            visitas?.map(visita => (
              <Card key={visita.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center border-l-4 border-pink-500">
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {getStatusBadge(visita.status)}
                      <span className="text-sm text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Agendado em{" "}
                        {format(new Date(visita.createdAt), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-1">
                          <User className="w-5 h-5 text-slate-400" />
                          {visita.clienteNome}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {visita.clienteTelefone}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-pink-600 mb-1">
                          <Calendar className="w-5 h-5" />
                          {format(
                            new Date(visita.dataAgendamento),
                            "dd 'de' MMMM 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </div>
                        {visita.tipoEvento && (
                          <div className="text-slate-600">
                            Interesse: {visita.tipoEvento}
                          </div>
                        )}
                      </div>
                    </div>

                    {visita.observacoes && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
                        "{visita.observacoes}"
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 md:w-48 flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100">
                    {visita.status === "agendada" && (
                      <>
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() =>
                            handleStatusChange(visita.id, "realizada")
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Realizada
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() =>
                            handleStatusChange(visita.id, "noshow")
                          }
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Não veio
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            handleStatusChange(visita.id, "cancelada")
                          }
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    {visita.status !== "agendada" && (
                      <div className="text-center text-sm text-slate-400">
                        Ações indisponíveis
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
