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
import { Downline, User } from "@/lib/api";
import { ArrowUpRightSquare } from "lucide-react";
import React from "react";
import { formatDate, formatMoney } from "@/utils/formatters";

interface PatrociniosCardProps {
  downlines: Downline[];
  setCurrentPage: (page: string) => void;
  downlinesAllCount: number;
}

export function PatrociniosCard({
  downlines,
  setCurrentPage,
  downlinesAllCount,
}: PatrociniosCardProps) {
  return (
    <Card
      className="
      flex flex-col items-start
      p-6 gap-2
      bg-[#121212] rounded-lg
      flex-none flex-grow-0
      border-0 h-[291px]
    "
    >
      <CardHeader className="p-0 w-full">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="whitespace-nowrap font-medium text-[#6C6C6C]">
              Total de patrocínios
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-1 w-full">
        <div className="text-3xl font-medium text-white">
          {downlinesAllCount}
        </div>
        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="
                w-[178px] text-greyscale-50 relative mt-[-1.00px] 
                font-h4 font-[number:var(--h4-font-weight)] text-[length:var(--h4-font-size)] 
                tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] 
                [font-style:var(--h4-font-style)]
                "
                >
                  Nome
                </TableHead>
                <TableHead
                  className="
                relative w-fit mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)]
                 text-greyscale-50 text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)]
                  leading-[var(--h4-line-height)] whitespace-nowrap [font-style:var(--h4-font-style)]
                "
                >
                  Nivel
                </TableHead>
                <TableHead
                  className="
                relative w-fit mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)] text-greyscale-50 
                text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)]
                 leading-[var(--h4-line-height)] whitespace-nowrap [font-style:var(--h4-font-style)]
                "
                >
                  Data de cadastro
                </TableHead>
                <TableHead
                  className="
                w-[61px] text-greyscale-50 text-right relative mt-[-1.00px] font-h4
                 font-[number:var(--h4-font-weight)] text-[length:var(--h4-font-size)] 
                 tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)]
                  [font-style:var(--h4-font-style)]
                "
                >
                  Ganhos
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downlines.slice(0, 3).map((downline) => (
                <TableRow
                  className="
                "
                  key={downline.nome}
                >
                  <TableCell
                    className="relative w-[178px] mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)]
                 text-primarywhite text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] 
                 leading-[var(--h4-line-height)] overflow-hidden text-ellipsis [display:-webkit-box]
                  [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--h4-font-style)]"
                  >
                    {downline.nome}
                  </TableCell>
                  <TableCell
                    className="relative w-7 mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)]
                   text-primarywhite text-[length:var(--h4-font-size)] 
                   tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] 
                   [font-style:var(--h4-font-style)]"
                  >
                    {downline.nivel_relativo}
                  </TableCell>
                  <TableCell
                    className="relative w-[103px] mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)]
                   text-primarywhite text-[length:var(--h4-font-size)] 
                   tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] 
                   [font-style:var(--h4-font-style)]"
                  >
                    {formatDate(downline.created_at)}
                  </TableCell>
                  <TableCell
                    className="relative w-[61px] mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)]
                   text-primarywhite text-[length:var(--h4-font-size)] text-right 
                   tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] 
                   [font-style:var(--h4-font-style)]"
                  >
                    {formatMoney(
                      downline.ganhos ? downline.ganhos : "0"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Button
          onClick={() => setCurrentPage("redes")}
          aria-label="Redes"
          className=" !flex-1 !flex justify-center cursor-pointer bg-transparent"
        >
          <div className="inline-flex items-center justify-center gap-2 relative rounded-sm text-greyscale-30">
            <div
              className="relative w-fit mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)]
             text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] 
             leading-[var(--h4-line-height)] whitespace-nowrap [font-style:var(--h4-font-style)]
             "
            >
              Ver lista de rede completa
            </div>
            <ArrowUpRightSquare className="text-greyscale-70 h-4 !relative !left-[unset] w-4 !top-[unset]" />
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
