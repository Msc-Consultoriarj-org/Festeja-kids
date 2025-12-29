import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { BarChart3, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
];

export default function Relatorios() {
  const { user, loading: authLoading } = useAuth();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<
    "mensal" | "trimestral" | "anual"
  >("mensal");
  const { data: festas, isLoading: loadingFestas } =
    trpc.festas.list.useQuery();
  const { data: pagamentos, isLoading: loadingPagamentos } =
    trpc.pagamentos.listAll.useQuery();
  const { data: custosVariaveis, isLoading: loadingCustosVar } =
    trpc.custos.variaveis.list.useQuery();
  const { data: custosFixos, isLoading: loadingCustosFixos } =
    trpc.custos.fixos.list.useQuery();

  const dadosRelatorio = useMemo(() => {
    if (!festas || !pagamentos) return null;

    // Análise Mensal
    const dadosMensais: Record<
      string,
      {
        mes: string;
        festas: number;
        faturamento: number;
        recebido: number;
        ticketMedio: number;
      }
    > = {};

    festas.forEach(f => {
      const mes = new Date(f.dataFesta).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      if (!dadosMensais[mes]) {
        dadosMensais[mes] = {
          mes,
          festas: 0,
          faturamento: 0,
          recebido: 0,
          ticketMedio: 0,
        };
      }
      dadosMensais[mes].festas++;
      dadosMensais[mes].faturamento += f.valorTotal;
    });

    pagamentos.forEach(p => {
      const mes = new Date(p.dataPagamento).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      if (dadosMensais[mes]) {
        dadosMensais[mes].recebido += p.valor;
      }
    });

    Object.values(dadosMensais).forEach(d => {
      d.ticketMedio = d.festas > 0 ? d.faturamento / d.festas : 0;
    });

    const graficoMensal = Object.values(dadosMensais)
      .sort((a, b) => {
        const dateA = new Date(a.mes.split(" de ").reverse().join(" "));
        const dateB = new Date(b.mes.split(" de ").reverse().join(" "));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-12) // Últimos 12 meses
      .map(d => ({
        mes: d.mes.split(" de ")[0].substring(0, 3),
        festas: d.festas,
        faturamento: d.faturamento / 100,
        recebido: d.recebido / 100,
        ticketMedio: d.ticketMedio / 100,
      }));

    // Análise Trimestral
    const dadosTrimestrais: Record<
      string,
      {
        trimestre: string;
        festas: number;
        faturamento: number;
        recebido: number;
      }
    > = {};

    festas.forEach(f => {
      const data = new Date(f.dataFesta);
      const ano = data.getFullYear();
      const trimestre = Math.floor(data.getMonth() / 3) + 1;
      const chave = `${ano} Q${trimestre}`;

      if (!dadosTrimestrais[chave]) {
        dadosTrimestrais[chave] = {
          trimestre: chave,
          festas: 0,
          faturamento: 0,
          recebido: 0,
        };
      }
      dadosTrimestrais[chave].festas++;
      dadosTrimestrais[chave].faturamento += f.valorTotal;
    });

    pagamentos.forEach(p => {
      const data = new Date(p.dataPagamento);
      const ano = data.getFullYear();
      const trimestre = Math.floor(data.getMonth() / 3) + 1;
      const chave = `${ano} Q${trimestre}`;

      if (dadosTrimestrais[chave]) {
        dadosTrimestrais[chave].recebido += p.valor;
      }
    });

    const graficoTrimestral = Object.values(dadosTrimestrais)
      .sort((a, b) => a.trimestre.localeCompare(b.trimestre))
      .slice(-8) // Últimos 8 trimestres
      .map(d => ({
        trimestre: d.trimestre,
        festas: d.festas,
        faturamento: d.faturamento / 100,
        recebido: d.recebido / 100,
      }));

    // Análise Anual
    const dadosAnuais: Record<
      number,
      {
        ano: number;
        festas: number;
        faturamento: number;
        recebido: number;
      }
    > = {};

    festas.forEach(f => {
      const ano = new Date(f.dataFesta).getFullYear();
      if (!dadosAnuais[ano]) {
        dadosAnuais[ano] = { ano, festas: 0, faturamento: 0, recebido: 0 };
      }
      dadosAnuais[ano].festas++;
      dadosAnuais[ano].faturamento += f.valorTotal;
    });

    pagamentos.forEach(p => {
      const ano = new Date(p.dataPagamento).getFullYear();
      if (dadosAnuais[ano]) {
        dadosAnuais[ano].recebido += p.valor;
      }
    });

    const graficoAnual = Object.values(dadosAnuais)
      .sort((a, b) => a.ano - b.ano)
      .map(d => ({
        ano: d.ano.toString(),
        festas: d.festas,
        faturamento: d.faturamento / 100,
        recebido: d.recebido / 100,
      }));

    // Análise de Custos
    const totalCustosVariaveis =
      custosVariaveis?.reduce((sum: number, c: any) => sum + c.valor, 0) || 0;
    const totalCustosFixos =
      custosFixos?.reduce((sum: number, c: any) => sum + c.valor, 0) || 0;
    const totalCustos = totalCustosVariaveis + totalCustosFixos;
    const totalReceita = festas.reduce((sum, f) => sum + f.valorTotal, 0);
    const lucro = totalReceita - totalCustos;

    const dadosCustosReceita = [
      { name: "Receita", value: totalReceita / 100 },
      { name: "Custos Variáveis", value: totalCustosVariaveis / 100 },
      { name: "Custos Fixos", value: totalCustosFixos / 100 },
      { name: "Lucro", value: lucro / 100 },
    ];

    return {
      graficoMensal,
      graficoTrimestral,
      graficoAnual,
      dadosCustosReceita,
      totalReceita,
      totalCustos,
      lucro,
      margemLucro: totalReceita > 0 ? (lucro / totalReceita) * 100 : 0,
    };
  }, [festas, pagamentos, custosVariaveis, custosFixos]);

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

  const isLoading =
    loadingFestas ||
    loadingPagamentos ||
    loadingCustosVar ||
    loadingCustosFixos;

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Relatórios
            </h1>
            <p className="text-muted-foreground">
              Análises e dashboards visuais do negócio
            </p>
          </div>
          <Select
            value={periodoSelecionado}
            onValueChange={v =>
              setPeriodoSelecionado(v as typeof periodoSelecionado)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : dadosRelatorio ? (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Receita Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R${" "}
                    {(dadosRelatorio.totalReceita / 100).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2 }
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Custos Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    R${" "}
                    {(dadosRelatorio.totalCustos / 100).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2 }
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Lucro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${dadosRelatorio.lucro >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    R${" "}
                    {(dadosRelatorio.lucro / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Margem de Lucro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${dadosRelatorio.margemLucro >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {dadosRelatorio.margemLucro.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Análise por Período */}
            {periodoSelecionado === "mensal" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>
                      Análise Mensal - Faturamento vs Recebido
                    </CardTitle>
                    <CardDescription>
                      Comparação de valores faturados e recebidos por mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={dadosRelatorio.graficoMensal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="mes" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                          }}
                          labelStyle={{ color: "#f3f4f6" }}
                          formatter={(value: number) =>
                            `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                          }
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="faturamento"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Faturamento"
                        />
                        <Area
                          type="monotone"
                          dataKey="recebido"
                          stackId="2"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="Recebido"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quantidade de Festas por Mês</CardTitle>
                    <CardDescription>
                      Evolução do número de festas realizadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dadosRelatorio.graficoMensal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="mes" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                          }}
                          labelStyle={{ color: "#f3f4f6" }}
                        />
                        <Legend />
                        <Bar dataKey="festas" fill="#8b5cf6" name="Festas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Médio por Mês</CardTitle>
                    <CardDescription>
                      Valor médio por festa ao longo do tempo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dadosRelatorio.graficoMensal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="mes" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                          }}
                          labelStyle={{ color: "#f3f4f6" }}
                          formatter={(value: number) =>
                            `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="ticketMedio"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Ticket Médio"
                          dot={{ fill: "#f59e0b", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {periodoSelecionado === "trimestral" && (
              <Card>
                <CardHeader>
                  <CardTitle>Análise Trimestral</CardTitle>
                  <CardDescription>Desempenho por trimestre</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dadosRelatorio.graficoTrimestral}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="trimestre" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#f3f4f6" }}
                        formatter={(value: number, name: string) => {
                          if (name === "festas") return value;
                          return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="faturamento"
                        fill="#3b82f6"
                        name="Faturamento"
                      />
                      <Bar dataKey="recebido" fill="#10b981" name="Recebido" />
                      <Bar dataKey="festas" fill="#8b5cf6" name="Festas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {periodoSelecionado === "anual" && (
              <Card>
                <CardHeader>
                  <CardTitle>Análise Anual</CardTitle>
                  <CardDescription>Comparação ano a ano</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dadosRelatorio.graficoAnual}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="ano" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#f3f4f6" }}
                        formatter={(value: number, name: string) => {
                          if (name === "festas") return value;
                          return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="faturamento"
                        fill="#3b82f6"
                        name="Faturamento"
                      />
                      <Bar dataKey="recebido" fill="#10b981" name="Recebido" />
                      <Bar dataKey="festas" fill="#8b5cf6" name="Festas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Análise de Custos vs Receita */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Custos vs Receita</CardTitle>
                <CardDescription>
                  Distribuição de receita, custos e lucro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={dadosRelatorio.dadosCustosReceita}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) =>
                        `${name}: R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosRelatorio.dadosCustosReceita.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                      }}
                      formatter={(value: number) =>
                        `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Nenhum dado disponível para relatórios
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
