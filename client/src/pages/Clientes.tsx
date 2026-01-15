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
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Eye, Pencil, Trash2, Search, Loader2, X } from "lucide-react";
import { Link } from "wouter";
import { useRef, useState } from "react";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: clientes, isLoading } = trpc.clientes.search.useQuery({
    searchTerm,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2
            className="h-8 w-8 animate-spin text-primary"
            aria-label="Carregando clientes..."
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus clientes</p>
          </div>
          <Link href="/clientes/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center gap-4">
              <CardTitle>Lista de Clientes</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  ref={inputRef}
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 pr-8"
                  aria-label="Buscar clientes"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      inputRef.current?.focus();
                    }}
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-colors"
                    aria-label="Limpar busca"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {clientes && clientes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map(cliente => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        {cliente.nome}
                      </TableCell>
                      <TableCell>{cliente.telefone || "-"}</TableCell>
                      <TableCell>{cliente.email || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/clientes/${cliente.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Visualizar cliente"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/clientes/${cliente.id}/editar`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Editar cliente"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Excluir cliente"
                            onClick={() => {
                              // TODO: Implementar exclusão
                              alert("Funcionalidade em desenvolvimento");
                            }}
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
                  {searchTerm
                    ? "Nenhum cliente encontrado com esse termo de busca."
                    : "Nenhum cliente cadastrado. Clique em 'Novo Cliente' para começar."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
