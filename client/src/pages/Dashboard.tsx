import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  DollarSign,
  PartyPopper,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.festas.stats.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu negócio
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Festas
              </CardTitle>
              <PartyPopper
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.agendadas || 0} agendadas, {stats?.realizadas || 0}{" "}
                realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento Total
              </CardTitle>
              <DollarSign
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.valorTotal || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor total de todas as festas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor a Receber
              </CardTitle>
              <TrendingUp
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.valorAReceber || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Saldo pendente de pagamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ticket Médio
              </CardTitle>
              <Calendar
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.ticketMedio || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor médio por festa realizada
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <Link href="/festas">
                  <PartyPopper className="mr-3 h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold">Festas</span>
                    <span className="text-xs text-muted-foreground font-normal group-hover:text-primary/80">
                      Gerenciar eventos
                    </span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <Link href="/clientes">
                  <Users className="mr-3 h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold">Clientes</span>
                    <span className="text-xs text-muted-foreground font-normal group-hover:text-primary/80">
                      Base de contatos
                    </span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <Link href="/custos">
                  <DollarSign className="mr-3 h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold">Custos</span>
                    <span className="text-xs text-muted-foreground font-normal group-hover:text-primary/80">
                      Controle financeiro
                    </span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <Link href="/relatorios">
                  <BarChart3 className="mr-3 h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold">Relatórios</span>
                    <span className="text-xs text-muted-foreground font-normal group-hover:text-primary/80">
                      Análise de dados
                    </span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Valor Recebido
                </span>
                <span className="font-semibold">
                  {formatCurrency(stats?.valorPago || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Valor a Receber
                </span>
                <span className="font-semibold">
                  {formatCurrency(stats?.valorAReceber || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Total</span>
                <span className="font-bold">
                  {formatCurrency(stats?.valorTotal || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
