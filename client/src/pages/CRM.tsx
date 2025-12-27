import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const leadSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  origem: z.string().default("organico"),
  valorPotencial: z
    .string()
    .transform(val => Number(val) * 100)
    .optional(), // Input em reais, salva em centavos
});

export default function CRM() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const utils = trpc.useContext();
  const { data: leads = [], isLoading } = trpc.clientes.list.useQuery();

  const updateStatusMutation = trpc.clientes.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado");
      utils.clientes.list.invalidate();
    },
  });

  const createLeadMutation = trpc.clientes.create.useMutation({
    onSuccess: () => {
      toast.success("Lead criado com sucesso");
      setIsDialogOpen(false);
      utils.clientes.list.invalidate();
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      origem: "organico",
      valorPotencial: "0",
    },
  });

  const handleMoveLead = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, statusFunil: status as any });
  };

  const onSubmit = (values: z.infer<typeof leadSchema>) => {
    createLeadMutation.mutate({
      ...values,
      statusFunil: "novo",
    });
  };

  if (isLoading) return <div className="p-8">Carregando CRM...</div>;

  // Filtrar apenas leads ativos (não perdidos) ou mostrar todos?
  // Por enquanto mostra todos, exceto talvez os "perdidos" que poderiam ir para uma lista separada ou coluna final.
  // O KanbanBoard já tem coluna "perdido", então ok.

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM de Vendas</h1>
          <p className="text-sm text-slate-500">
            Gerencie seus leads e oportunidades
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Lead</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: João Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone / WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="(21) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valorPotencial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Potencial (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0,00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="origem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origem</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a origem" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="organico">Orgânico</SelectItem>
                            <SelectItem value="anuncio_insta">
                              Anúncio Instagram
                            </SelectItem>
                            <SelectItem value="anuncio_google">
                              Anúncio Google
                            </SelectItem>
                            <SelectItem value="indicacao">Indicação</SelectItem>
                            <SelectItem value="passante">Passante</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      Salvar Lead
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        <KanbanBoard leads={leads} onMoveLead={handleMoveLead} />
      </main>
    </div>
  );
}
