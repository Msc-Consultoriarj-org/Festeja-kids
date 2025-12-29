import React from "react";
import {
  format,
  addMinutes,
  isSameDay,
  setHours,
  setMinutes,
  isBefore,
  startOfToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  date: Date | undefined;
  busySlots: Date[];
  onSelectSlot: (date: Date) => void;
  selectedSlot?: Date;
}

export function TimeSlotPicker({
  date,
  busySlots,
  onSelectSlot,
  selectedSlot,
}: TimeSlotPickerProps) {
  if (!date) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        Selecione uma data primeiro
      </div>
    );
  }

  // Gerar slots de 10:00 às 21:00 (último slot 20:30)
  const slots: Date[] = [];
  let currentTime = setMinutes(setHours(date, 10), 0);
  const endTime = setMinutes(setHours(date, 21), 0);

  while (isBefore(currentTime, endTime)) {
    slots.push(currentTime);
    currentTime = addMinutes(currentTime, 30);
  }

  // Verificar se o slot está ocupado ou no passado
  const isSlotDisabled = (slot: Date) => {
    const now = new Date();
    if (isBefore(slot, now)) return true;

    return busySlots.some(busy => busy.getTime() === slot.getTime());
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-slate-900">
        Horários Disponíveis para{" "}
        {format(date, "dd 'de' MMMM", { locale: ptBR })}
      </h3>

      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {slots.map((slot, index) => {
            const disabled = isSlotDisabled(slot);
            const isSelected = selectedSlot?.getTime() === slot.getTime();

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "w-full",
                  isSelected && "bg-pink-500 hover:bg-pink-600",
                  disabled &&
                    "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400"
                )}
                disabled={disabled}
                onClick={() => onSelectSlot(slot)}
              >
                {format(slot, "HH:mm")}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-slate-300 bg-white"></div>
          <span>Livre</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div>
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  );
}
