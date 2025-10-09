import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  formatDateMobile,
  formatMoney,
  parseCustomDateFormat,
} from "@/utils/formatters";
import React, { useEffect, useMemo, useState } from "react";
import { DatePicker } from "./date-picker";
import { StringToggleGroup } from "./string-togglegroup";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ExtratoSheet } from "./extrato-sheet";
import { authManager } from "@/lib/auth";
import { apiService } from "@/lib/api";

const typeOptions = [
  { value: "todos", label: "Todos" },
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
];

function toISODateString(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface Transaction {
  data: string;
  origem: string;
  status: string;
  valor: string;
  tipo: "entrada" | "saida";
}

interface SaquesProps {}

export function Saques({}: SaquesProps) {
  const [typeFilter, setTypeFilter] = useState("todos");
  const [dataInicial, setDataInicial] = useState<Date | undefined>(undefined);
  const [dataFinal, setDataFinal] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 9;
  const [initialTableData, setInitialTableData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authManager.getToken();
    if (!token) return;

    const fetchSaques = async () => {
      try {
        setLoading(true);
        const [saquesRes] = await Promise.all([apiService.getSaques(token)]);

        let mergedTableData: Transaction[] = [];

        if (saquesRes.success && saquesRes.data) {
          const mappedSaques = saquesRes.data.map(
            (item: {
              created_at: any;
              description: any;
              refunded: any;
              amount: any;
            }) => ({
              data: item.created_at,
              origem: item.description,
              status: item.refunded ? "aprovado" : "pendente",
              valor: item.amount,
              tipo: "saida",
            })
          );
          mergedTableData = [...mergedTableData, ...mappedSaques];
        }

        mergedTableData.sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        setInitialTableData(mergedTableData);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaques();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, dataInicial, dataFinal]);

  const filteredTableData = useMemo(() => {
    const startDate = toISODateString(dataInicial);
    const endDate = toISODateString(dataFinal);

    return initialTableData.filter((item) => {
      if (
        searchTerm &&
        !item.origem.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (typeFilter !== "todos" && item.tipo !== typeFilter) {
        return false;
      }

      if (startDate && item.data < startDate) {
        return false;
      }

      if (endDate && item.data > endDate) {
        return false;
      }

      return true;
    });
  }, [initialTableData, typeFilter, dataInicial, dataFinal, searchTerm]);

  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTableData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTableData, currentPage]);

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push({ number: i.toString(), active: i === currentPage });
      }
    } else {
      if (currentPage <= 3) {
        // Primeiras páginas
        for (let i = 1; i <= 4; i++) {
          items.push({ number: i.toString(), active: i === currentPage });
        }
        items.push({ number: "...", active: false });
        items.push({ number: totalPages.toString(), active: false });
      } else if (currentPage >= totalPages - 2) {
        // Últimas páginas
        items.push({ number: "1", active: false });
        items.push({ number: "...", active: false });
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push({ number: i.toString(), active: i === currentPage });
        }
      } else {
        // Páginas do meio
        items.push({ number: "1", active: false });
        items.push({ number: "...", active: false });
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push({ number: i.toString(), active: i === currentPage });
        }
        items.push({ number: "...", active: false });
        items.push({ number: totalPages.toString(), active: false });
      }
    }

    return items;
  };

  function onTypeChange(value: string | undefined) {
    if (value) {
      setTypeFilter(value);
      setCurrentPage(1);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex flex-col items-start gap-6 flex-1 self-stretch grow mt-6 w-full">
      <div className="flex items-center justify-end md:gap-6 relative flex-1 self-stretch w-full grow">
        <div className="flex flex-col items-start gap-6 w-full">
          <div className="flex items-center justify-end gap-6 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-1 relative flex-1 grow min-w-30">
              <div className="flex h-11 items-center gap-2 px-4 py-3 relative self-stretch w-full bg-primarywhite rounded-sm border border-solid border-greyscale-30">
                <div className="flex flex-col items-start justify-center gap-2 relative flex-1 grow">
                  <Input
                    placeholder="Pesquise por nome"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="relative self-stretch mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)] text-black text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--h4-font-style)] border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <Search className="!relative !w-4 !h-4" />
              </div>
            </div>
            <div className="hidden md:flex w-[372px] items-center gap-2">
              <DatePicker
                id="data-inicial"
                label="Data de início"
                dateValue={dataInicial}
                onDateChange={setDataInicial}
              />
              <DatePicker
                id="data-final"
                label="Data de término"
                dateValue={dataFinal}
                onDateChange={setDataFinal}
              />
            </div>

            <div className="flex md:hidden w-[103px]">
              <ExtratoSheet
                typeFilter={typeFilter}
                onTypeChange={onTypeChange}
                typeOptions={typeOptions}
                dataInicial={dataInicial}
                setDataInicial={setDataInicial}
                dataFinal={dataFinal}
                setDataFinal={setDataFinal}
              />
            </div>
          </div>
          <Card className="flex-col items-end gap-4 self-stretch w-full flex min-h-[70px] p-4 md:p-6 relative flex-1 grow bg-primaryblack rounded-lg overflow-hidden border-0">
            <CardContent className="w-full p-0">
              <div className="relative self-stretch mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-40 text-[11px] md:text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)] mb-4">
                {filteredTableData.length} movimentos
              </div>

              <div className="overflow-x-auto">
                <Table className="w-full min-w-[240px] md:min-w-full">
                  <TableHeader>
                    <TableRow className="flex items-start justify-between pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-greyscale-70 hover:bg-transparent">
                      <TableHead className="w-[15%] min-w-[40px] px-1 md:px-2 py-2 text-greyscale-50 relative font-h2 font-[number:var(--h2-font-weight)] text-xs md:text-sm tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                        Data
                      </TableHead>
                      <TableHead className="w-[55%] min-w-[120px] px-1 md:px-2 py-2 text-greyscale-50 relative font-h2 font-[number:var(--h2-font-weight)] text-xs md:text-sm tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                        Descrição
                      </TableHead>
                      <TableHead className="w-[15%] min-w-[40px] px-1 md:px-2 py-2 text-greyscale-50 relative font-h2 font-[number:var(--h2-font-weight)] text-xs md:text-sm tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                        Status
                      </TableHead>
                      <TableHead className="w-[15%] min-w-[70px] px-1 md:px-2 py-2 text-greyscale-50 relative font-h2 font-[number:var(--h2-font-weight)] text-xs md:text-sm tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)] text-right">
                        Valor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTableData.map((transaction, index) => {
                      const valueColor =
                        transaction.tipo === "entrada"
                          ? "text-supportgreen"
                          : "text-supportred";
                      return (
                        <TableRow
                          key={index}
                          className="flex items-center justify-between px-0 py-3 relative self-stretch w-full flex-[0_0_auto] border-0 hover:bg-transparent"
                        >
                          <TableCell className="w-[15%] min-w-[40px] px-1 md:px-2 py-3 text-white text-xs md:text-sm">
                            <span className="md:hidden">
                              {formatDateMobile(transaction.data)}
                            </span>
                            <span className="hidden md:inline">
                              {formatDate(transaction.data)}
                            </span>
                          </TableCell>
                          <TableCell className="w-[55%] min-w-[120px] px-1 md:px-2 py-3 text-white font-bold text-xs md:text-sm overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]">
                            Solicitação de saque
                          </TableCell>
                          <TableCell className="w-[15%] min-w-[40px] px-1 md:px-2 py-3 text-white font-bold text-xs md:text-sm overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]">
                            {transaction.status === "pendente"
                              ? "Pendente"
                              : "Pago"}
                          </TableCell>
                          <TableCell
                            className={`w-[15%] min-w-[70px] px-1 md:px-2 py-3 text-xs md:text-sm text-right font-bold ${valueColor}`}
                          >
                            {formatMoney(transaction.valor)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <Pagination className="inline-flex items-end justify-end gap-1 relative flex-[0_0_auto] mb-[-11.38px] mt-4">
                <PaginationContent className="flex items-center gap-1">
                  {getPaginationItems().map((item, index) => (
                    <PaginationItem key={index}>
                      {item.number === "..." ? (
                        <div className="flex items-center justify-center h-8 w-8 text-white">
                          {item.number}
                        </div>
                      ) : (
                        <PaginationLink
                          className={`inline-flex min-w-8 h-8 items-center justify-center gap-2.5 p-2 relative flex-[0_0_auto] rounded-lg ${
                            item.active
                              ? "bg-primary text-primaryblack"
                              : "text-white hover:bg-greyscale-70"
                          }`}
                          onClick={() =>
                            handlePageChange(parseInt(item.number))
                          }
                        >
                          <div className="relative w-fit mt-[-3.50px] mb-[-1.50px] font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                            {item.number}
                          </div>
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
