import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { formatMoney } from "@/utils/formatters";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { authManager } from "@/lib/auth"; // se existir
import { API_BASE_URL } from "@/lib/api"; // se existir

interface SaldoCardProps {
  saldo: string;
  info?: string;
}

export function SaldoCard({ info, saldo }: SaldoCardProps) {
  return (
    <Card className="flex flex-col items-start p-6 gap-2 bg-[#121212] rounded-lg flex-none flex-grow-0 border-0 h-auto min-h-[128px]">
      <CardHeader className="p-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-4 md:gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="whitespace-nowrap font-medium text-[#6C6C6C]">
              Saldo total
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center text-[#565656] hover:text-[#6C6C6C] transition-colors">
                  <Info size={24} className="font-normal" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] bg-[#121212]">
                {info ?? "Informações adicionais sobre o saldo total"}
              </TooltipContent>
            </Tooltip>
          </div>

          <ToggleGroup
            type="single"
            className="w-full md:w-auto text-[#959595] text-[12px] border-[1px] border-[#424242] px-2 py-1 gap-1 overflow-hidden"
          >
            <ToggleGroupItem value="hoje" className="hover:bg-[#424242] hover:text-[#C0C0C0] data-[state=on]:bg-[#FF842A] h-[26px] data-[state=on]:shadow-[0px_9px_40px_0px_#FF964A] font-normal flex-initial">
              Hoje
            </ToggleGroupItem>
            <ToggleGroupItem value="semana" className="hover:bg-[#424242] hover:text-[#C0C0C0] data-[state=on]:bg-[#FF842A] h-[26px] data-[state=on]:shadow-[0px_9px_40px_0px_#FF964A] font-normal flex-initial">
              Semana
            </ToggleGroupItem>
            <ToggleGroupItem value="mes" className="hover:bg-[#424242] hover:text-[#C0C0C0] data-[state=on]:bg-[#FF842A] h-[26px] data-[state=on]:shadow-[0px_9px_40px_0px_#FF964A] font-normal flex-initial">
              Mês
            </ToggleGroupItem>
            <ToggleGroupItem value="ano" className="hover:bg-[#424242] hover:text-[#C0C0C0] data-[state=on]:bg-[#FF842A] h-[26px] data-[state=on]:shadow-[0px_9px_40px_0px_#FF964A] font-normal flex-initial">
              12 meses
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-1 w-full mt-4 md:mt-0">
        <div className="text-3xl font-medium text-white">
          {formatMoney(saldo)}
        </div>
      </CardContent>
    </Card>
  );
}
