import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TimeSlotPicker } from "@/components/agenda/TimeSlotPicker";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "wouter";
import { motion } from "framer-motion";

const formSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório"),
  telefone: z.string().min(8, "Telefone é obrigatório"),
  tipoEvento: z.string().optional(),
  observacoes: z.string().optional(),
});

export default function Agendamento() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | undefined>();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Data/Hora, 2: Dados, 3: Sucesso

  const createMutation = trpc.visitas.create.useMutation({
    onSuccess: () => {
      setStep(3);
      toast.success("Visita agendada com sucesso!");
    },
    onError: error => {
      toast.error(`Erro ao agendar: ${error.message}`);
    },
  });

  // Buscar horários ocupados
  const { data: busySlots = [] } = trpc.visitas.getBusySlots.useQuery(
    {
      start: date ? new Date(date.setHours(0, 0, 0, 0)).toISOString() : "",
      end: date ? new Date(date.setHours(23, 59, 59, 999)).toISOString() : "",
    },
    { enabled: !!date }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      tipoEvento: "",
      observacoes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedSlot) {
      toast.error("Selecione um horário para a visita");
      return;
    }

    createMutation.mutate({
      clienteNome: values.nome,
      clienteTelefone: values.telefone,
      dataAgendamento: selectedSlot.toISOString(),
      tipoEvento: values.tipoEvento,
      observacoes: values.observacoes,
    });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedSlot(undefined); // Limpar slot ao mudar data
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="pl-0 hover:pl-2 transition-all text-slate-600 hover:text-pink-600"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o início
            </Link>
          </Button>
        </div>

        {step === 3 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Agendamento Confirmado!
            </h2>
            <p className="text-slate-600 mb-8">
              Sua visita foi agendada com sucesso. Estamos ansiosos para te
              receber no Festeja Kids!
            </p>
            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-2">
                <CalendarIcon className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-slate-900">
                  {selectedSlot &&
                    new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    }).format(selectedSlot)}
                </span>
              </div>
              <div className="text-sm text-slate-500 ml-8">
                Rua Sirici, 644 - Marechal Hermes
              </div>
            </div>
            <Button
              asChild
              className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full h-12"
            >
              <Link href="/">Voltar para o site</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Coluna Esquerda: Informações */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Agende sua Visita
                </h1>
                <p className="text-slate-600">
                  Venha conhecer o espaço perfeito para a festa do seu filho.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  Como funciona?
                </h3>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="font-bold text-slate-300">1</span>
                    Escolha o melhor dia e horário no calendário.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-slate-300">2</span>
                    Preencha seus dados de contato.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-slate-300">3</span>
                    Receba a confirmação imediata.
                  </li>
                </ul>
              </div>
            </div>

            {/* Coluna Direita: Formulário */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="text-xl">
                    {step === 1 ? "Selecione Data e Horário" : "Seus Dados"}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Passo {step} de 2
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {step === 1 && (
                    <div className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex justify-center">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            locale={ptBR}
                            className="rounded-md border shadow-sm"
                            disabled={date =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                          />
                        </div>
                        <div>
                          <TimeSlotPicker
                            date={date}
                            busySlots={busySlots.map(d => new Date(d))}
                            onSelectSlot={setSelectedSlot}
                            selectedSlot={selectedSlot}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button
                          onClick={() => setStep(2)}
                          disabled={!selectedSlot}
                          className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8"
                        >
                          Continuar
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Seu Nome</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: Maria Silva"
                                    autoComplete="name"
                                    {...field}
                                    className="rounded-xl"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="telefone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>WhatsApp / Telefone</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="(21) 99999-9999"
                                    autoComplete="tel"
                                    {...field}
                                    className="rounded-xl"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="tipoEvento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Evento (Opcional)</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Aniversário 1 Ano">
                                    Aniversário 1 Ano
                                  </SelectItem>
                                  <SelectItem value="Aniversário Infantil">
                                    Aniversário Infantil
                                  </SelectItem>
                                  <SelectItem value="Outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="observacoes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Observações (Opcional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Alguma dúvida ou preferência?"
                                  className="resize-none rounded-xl"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-between pt-4 border-t">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="text-slate-600"
                          >
                            Voltar
                          </Button>
                          <Button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8"
                          >
                            {createMutation.isPending ? (
                              <>
                                <Spinner className="mr-2 h-4 w-4 text-white" />
                                Agendando...
                              </>
                            ) : (
                              "Confirmar Agendamento"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
