import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { DollarSign, Loader2, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";

export default function Financeiro() {
  const { user, loading: authLoading } = useAuth();
  const { data: festas, isLoading: loadingFestas } = trpc.festas.list.useQuery();
  const { data: pagamentos, isLoading: loadingPagamentos } = trpc.pagamentos.listAll.useQuery();

  const estatisticas = useMemo(() => {
    if (!festas || !pagamentos) return null;

    const totalFaturamento = festas.reduce((sum, f) => sum + f.valorTotal, 0);
    const totalRecebido = pagamentos.reduce((sum, p) => sum + p.valor, 0);
    const totalAReceber = totalFaturamento - totalRecebido;
    
    // Agrupar pagamentos por mês
    const pagamentosPorMes: Record<string, number> = {};
    pagamentos.forEach((p) => {
      const mes = new Date(p.dataPagamento).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      pagamentosPorMes[mes] = (pagamentosPorMes[mes] || 0) + p.valor;
    });

    // Festas com saldo devedor
    const festasComSaldo = festas.filter(f => f.valorPago < f.valorTotal);
    
    return {
      totalFaturamento,
      totalRecebido,
      totalAReceber,
      pagamentosPorMes,
      festasComSaldo,
      percentualRecebido: totalFaturamento > 0 ? (totalRecebido / totalFaturamento) * 100 : 0,
    };
  }, [festas, pagamentos]);

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
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-8 w-8" />
              Financeiro
            </h1>
            <p className="text-muted-foreground">Visão completa do fluxo de caixa e recebimentos</p>
          </div>
          <Button onClick={() => window.location.href = "/financeiro/registrar"} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Pagamento
          </Button>
        </div>

        {loadingFestas || loadingPagamentos ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : estatisticas ? (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Faturamento Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {(estatisticas.totalFaturamento / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor total de todas as festas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Total Recebido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {(estatisticas.totalRecebido / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {estatisticas.percentualRecebido.toFixed(1)}% do faturamento total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-600">
                    <TrendingDown className="h-4 w-4" />
                    A Receber
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    R$ {(estatisticas.totalAReceber / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {estatisticas.festasComSaldo.length} festas com saldo pendente
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recebimentos por Mês */}
            <Card>
              <CardHeader>
                <CardTitle>Recebimentos por Mês</CardTitle>
                <CardDescription>Histórico de pagamentos recebidos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead className="text-right">Valor Recebido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(estatisticas.pagamentosPorMes)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([mes, valor]) => (
                        <TableRow key={mes}>
                          <TableCell className="capitalize font-medium">{mes}</TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            R$ {(valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Festas com Saldo Devedor */}
            <Card>
              <CardHeader>
                <CardTitle>Festas com Saldo Devedor</CardTitle>
                <CardDescription>
                  {estatisticas.festasComSaldo.length} festas com pagamento pendente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data da Festa</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead className="text-right">Pago</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estatisticas.festasComSaldo
                      .sort((a, b) => new Date(a.dataFesta).getTime() - new Date(b.dataFesta).getTime())
                      .map((festa) => {
                        const saldo = festa.valorTotal - festa.valorPago;
                        return (
                          <TableRow key={festa.id}>
                            <TableCell className="font-medium">{festa.codigo}</TableCell>
                            <TableCell>{festa.clienteNome}</TableCell>
                            <TableCell>
                              {new Date(festa.dataFesta).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {(festa.valorTotal / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              R$ {(festa.valorPago / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-orange-600">
                              R$ {(saldo / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={festa.status === "agendada" ? "default" : "secondary"}>
                                {festa.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Nenhum dado financeiro disponível
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
