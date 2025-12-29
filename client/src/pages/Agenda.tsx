import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CalendarDays, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function Agenda() {
  const { user, loading: authLoading } = useAuth();
  const { data: festas, isLoading } = trpc.festas.list.useQuery();
  const [mesAtual, setMesAtual] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  });

  // Gerar dias do mês
  const diasDoMes = useMemo(() => {
    const [ano, mes] = mesAtual.split("-").map(Number);
    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = new Date(ano, mes, 0);
    const dias: Date[] = [];

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes - 1, dia));
    }

    return dias;
  }, [mesAtual]);

  // Agrupar festas por dia
  const festasPorDia = useMemo(() => {
    if (!festas) return {};

    const grupos: Record<string, typeof festas> = {};

    festas.forEach(festa => {
      const data = new Date(festa.dataFesta);
      const diaKey = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;

      if (!grupos[diaKey]) {
        grupos[diaKey] = [];
      }
      grupos[diaKey].push(festa);
    });

    return grupos;
  }, [festas]);

  const formatarMesAno = (mesAno: string) => {
    const [ano, mes] = mesAno.split("-");
    const data = new Date(parseInt(ano), parseInt(mes) - 1);
    return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const mudarMes = (direcao: number) => {
    const [ano, mes] = mesAtual.split("-").map(Number);
    const novaData = new Date(ano, mes - 1 + direcao, 1);
    setMesAtual(
      `${novaData.getFullYear()}-${String(novaData.getMonth() + 1).padStart(2, "0")}`
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDays className="h-8 w-8" />
            Agenda de Festas
          </h1>
          <p className="text-muted-foreground">
            Visualize as festas em formato de agenda
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => mudarMes(-1)}
                  className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  ← Anterior
                </button>
                <CardTitle className="capitalize">
                  {formatarMesAno(mesAtual)}
                </CardTitle>
                <button
                  onClick={() => mudarMes(1)}
                  className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  Próximo →
                </button>
              </div>
              <CardDescription>
                {
                  Object.values(festasPorDia)
                    .flat()
                    .filter(f => {
                      const data = new Date(f.dataFesta);
                      const [ano, mes] = mesAtual.split("-").map(Number);
                      return (
                        data.getFullYear() === ano &&
                        data.getMonth() === mes - 1
                      );
                    }).length
                }{" "}
                festas neste mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {diasDoMes.map(dia => {
                  const diaKey = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;
                  const festasNoDia = festasPorDia[diaKey] || [];
                  const hoje = new Date();
                  const ehHoje = dia.toDateString() === hoje.toDateString();

                  return (
                    <div
                      key={diaKey}
                      className={`border rounded-lg p-4 ${ehHoje ? "border-primary bg-primary/5" : ""} ${festasNoDia.length > 0 ? "bg-accent/50" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold">
                            {dia.toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "2-digit",
                            })}
                            {ehHoje && (
                              <Badge className="ml-2" variant="default">
                                Hoje
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {festasNoDia.length > 0
                              ? `${festasNoDia.length} ${festasNoDia.length === 1 ? "festa" : "festas"}`
                              : "Sem festas"}
                          </div>
                        </div>
                      </div>

                      {festasNoDia.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {festasNoDia.map(festa => (
                            <div
                              key={festa.id}
                              className="border-l-4 border-primary pl-3 py-2 bg-background rounded-r"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">
                                    {festa.codigo}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {festa.clienteNome}
                                  </div>
                                  {festa.horario && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      🕐 {festa.horario}
                                    </div>
                                  )}
                                  {festa.tema && (
                                    <div className="text-xs text-muted-foreground">
                                      🎨 {festa.tema}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-sm">
                                    R${" "}
                                    {(festa.valorTotal / 100).toLocaleString(
                                      "pt-BR",
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </div>
                                  <Badge
                                    variant={
                                      festa.status === "agendada"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {festa.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
