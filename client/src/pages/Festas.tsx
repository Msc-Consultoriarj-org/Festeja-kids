import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatDate } from "@/const";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";

export default function Festas() {
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const utils = trpc.useUtils();
  const { data: festas, isLoading } = trpc.festas.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();

  const deleteMutation = trpc.festas.delete.useMutation({
    onSuccess: () => {
      toast.success("Festa excluída com sucesso!");
      utils.festas.list.invalidate();
    },
    onError: error => {
      toast.error(`Erro ao excluir festa: ${error.message}`);
    },
  });

  const festasFiltradas = festas?.filter(festa => {
    if (statusFilter === "todas") return true;
    return festa.status === statusFilter;
  });

  const getClienteNome = (clienteId: number) => {
    const cliente = clientes?.find(c => c.id === clienteId);
    return cliente?.nome || "Cliente não encontrado";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      agendada: "default",
      realizada: "secondary",
      cancelada: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Festas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todas as festas cadastradas
            </p>
          </div>
          <Link href="/festas/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Festa
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Festas</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="agendada">Agendadas</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {festasFiltradas && festasFiltradas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fechamento</TableHead>
                    <TableHead>Data da Festa</TableHead>
                    <TableHead>Convidados</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {festasFiltradas.map(festa => (
                    <TableRow key={festa.id}>
                      <TableCell className="font-medium">
                        {festa.codigo}
                      </TableCell>
                      <TableCell>{getClienteNome(festa.clienteId)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(festa.dataFechamento)}
                      </TableCell>
                      <TableCell>{formatDate(festa.dataFesta)}</TableCell>
                      <TableCell>{festa.numeroConvidados}</TableCell>
                      <TableCell>{formatCurrency(festa.valorTotal)}</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(festa.valorPago)}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        {formatCurrency(festa.valorTotal - festa.valorPago)}
                      </TableCell>
                      <TableCell>{getStatusBadge(festa.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/festas/${festa.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Ver detalhes da festa"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/festas/${festa.id}/editar`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Editar festa"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (
                                confirm(
                                  "Tem certeza que deseja excluir esta festa?"
                                )
                              ) {
                                deleteMutation.mutate({ id: festa.id });
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            aria-label="Excluir festa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma festa encontrada. Clique em "Nova Festa" para começar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
