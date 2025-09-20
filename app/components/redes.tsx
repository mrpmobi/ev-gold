import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { API_BASE_URL, apiService, Downline } from "@/lib/api";
import { formatDate, formatMoney } from "@/utils/formatters";
import { Search } from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { RedesSheet } from "./redes-sheet";
import { StringToggleGroup } from "./string-togglegroup";
import { authManager } from "@/lib/auth";

const levelOptions = [
  { value: "todos", label: "Todos" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
];

const timeOptions = [
  { value: "hoje", label: "Hoje" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mês" },
  { value: "12meses", label: "12 meses" },
  { value: "sempre", label: "Sempre" },
];

interface RedesProps {
  diretos?: number;
  downlinesAllCount: number;
}

export function Redes({ diretos, downlinesAllCount }: RedesProps) {
  const [downlines, setDownlines] = useState<Downline[]>([]);
  const [levelFilter, setLevelFilter] = useState("todos");
  const [timeFilter, setTimeFilter] = useState("sempre");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 9;

  const fetchDownlines = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = authManager.getToken();
      if (!token) return;

      const queryParams = new URLSearchParams();
      const offset = (currentPage - 1) * itemsPerPage;

      
      queryParams.append("offset", offset.toString());

      if (levelFilter !== "todos") {
        queryParams.append("nivel", levelFilter);
      }

      /*
      if (timeFilter !== "sempre") {
        queryParams.append("time", timeFilter);
      }

      queryParams.append("limit", itemsPerPage.toString());
      */

      if (searchTerm) {
        queryParams.append("name", searchTerm);
      }

      const res = await apiService.getUserDownlines(token);

      if (res.success && res.data) {
        setDownlines(res.data.downlines || []);
        const somaTotal = Object.values(res.data.contagem_por_nivel).reduce(
            (total, valor) => total + valor,
            0
          );
        setTotalCount(somaTotal);
      } else {
        console.error("Failed to fetch downlines:", res.data);
        setDownlines([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching downlines:", err);
      setDownlines([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, levelFilter, timeFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchDownlines();
  }, [fetchDownlines]);

  const statsData = [
    { label: "Total de patrocínios", value: downlinesAllCount },
    {
      label: "Total de ganhos",
      value: 0, /*formatMoney(
        downlines
          .reduce((total, downline) => total + (downline.total_valor || 0), 0)
          .toString()
      ),*/
    },
  ];

  const tableData = useMemo(() => {
    return downlines.map((downline) => ({
      id: downline.id,
      name: downline.name,
      level: downline.nivel,
      levelBg:
        downline.nivel === 1
          ? "bg-primary"
          : downline.nivel === 2
          ? "bg-greyscale-70"
          : "bg-greyscale-40",
      levelText:
        downline.nivel === 1
          ? "text-primaryblack"
          : downline.nivel === 2
          ? "text-white"
          : "text-primaryblack",
      date: "",
      ganhos: formatMoney("0"),
    }));
  }, [downlines]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  const onLevelChange = (value: string | undefined) => {
    if (value) {
      setLevelFilter(value);
      setCurrentPage(1);
    }
  };

  const onTimeChange = (value: string | undefined) => {
    if (value) {
      setTimeFilter(value);
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col items-start gap-6 flex-1 self-stretch grow mt-6 w-full">
      <div className="flex items-center justify-end md:gap-6 relative flex-1 self-stretch w-full grow">
        <div className="flex flex-col items-start gap-6 w-full">
          <div className="flex gap-2 md:gap-6 w-full">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                className="flex-1 min-h-[70px] bg-primaryblack rounded-lg border-0 p-4 md:p-6"
              >
                <CardContent className="flex-row md:flex w-full md:items-center md:justify-between p-0 space-y-4 md:space-y-0">
                  <div className="text-greyscale-40 font-epilogue text-sm font-normal whitespace-nowrap text-left">
                    {stat.label}
                  </div>
                  <div className="text-white font-epilogue text-sm font-normal whitespace-nowrap md:text-right">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-end gap-6 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-1 relative flex-1 grow min-w-40 ">
              <div className="flex h-11 items-center gap-2 px-4 py-3 relative self-stretch w-full bg-primarywhite rounded-sm border border-solid border-greyscale-30">
                <div className="flex flex-col items-start justify-center gap-2 relative flex-1 grow">
                  <Input
                    placeholder="Pesquise por nome"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="relative self-stretch mt-[-1.00px] font-h4 font-[number:var(--h4-font-weight)] text-black text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--h4-font-style)] border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <Search className="!relative !w-4 !h-4" />
              </div>
            </div>

            <div className="hidden md:flex md:space-x-3 items-end">
              <StringToggleGroup
                filter={levelFilter}
                onChange={onLevelChange}
                options={levelOptions}
                label="Nível"
              />
              <StringToggleGroup
                filter={timeFilter}
                onChange={onTimeChange}
                options={timeOptions}
                label="Período"
              />
            </div>

            <div className="md:hidden w-[103px]">
              <RedesSheet
                levelFilter={levelFilter}
                timeFilter={timeFilter}
                levelOptions={levelOptions}
                timeOptions={timeOptions}
                onLevelChange={onLevelChange}
                onTimeChange={onTimeChange}
              />
            </div>
          </div>

          <Card className="flex-col items-end gap-4 self-stretch w-full flex min-h-[70px] relative flex-1 grow bg-primaryblack rounded-lg overflow-hidden border-0">
            <CardContent className="w-full p-1 md:p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-white">Carregando...</div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="flex items-start justify-between pt-0 pb-2 px-0 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-greyscale-70 hover:bg-transparent min-w-[320px]">
                          <TableHead className="w-[5%] min-w-[50px] mt-[-1.00px] text-greyscale-50 relative font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)] h-auto p-0">
                            Id
                          </TableHead>

                          <TableHead className="w-[35%] min-w-[100px] mt-[-1.00px] text-greyscale-50 relative font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)] h-auto p-0">
                            Nome
                          </TableHead>

                          <TableHead className="w-[15%] min-w-[50px] mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-50 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)] h-auto p-0 text-center">
                            Nível
                          </TableHead>

                          <TableHead className="w-[25%] min-w-[80px] mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-50 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)] h-auto p-0">
                            Data
                          </TableHead>

                          <TableHead className="w-[20%] min-w-[70px] mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-50 text-[length:var(--h2-font-size)] text-right tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)] h-auto p-0">
                            Ganhos
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.length > 0 ? (
                          tableData.map((row, index) => (
                            <TableRow
                              key={index}
                              className="flex items-center justify-between px-0 py-3 relative self-stretch w-full flex-[0_0_auto] border-0 hover:bg-transparent min-w-[320px]"
                            >
                              <TableCell className="w-[5%] min-w-[50px] relative mt-[-0.50px] font-bold font-h2 text-white text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--h2-font-style)] p-0">
                                {row.id}
                              </TableCell>

                              <TableCell className="w-[35%] min-w-[100px] relative mt-[-0.50px] font-bold font-h2 text-white text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--h2-font-style)] p-0">
                                {row.name}
                              </TableCell>

                              <TableCell className="w-[15%] min-w-[50px] p-0 flex justify-center">
                                <Badge
                                  className={`inline-flex flex-col min-w-[33px] items-center justify-center gap-2.5 px-2 py-0.5 relative flex-[0_0_auto] ${row.levelBg} rounded-[80px] hover:${row.levelBg}`}
                                >
                                  <div
                                    className={`mt-[-1.00px] ${row.levelText} leading-[18.2px] relative w-fit [font-family:'Epilogue-Regular',Helvetica] font-normal text-sm tracking-[0] whitespace-nowrap`}
                                  >
                                    {row.level}
                                  </div>
                                </Badge>
                              </TableCell>

                              <TableCell className="w-[25%] min-w-[80px] relative mt-[-0.50px] font-h2 font-[number:var(--h2-font-weight)] text-white text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)] p-0">
                                {formatDate(row.date)}
                              </TableCell>

                              <TableCell className="w-[20%] min-w-[70px] relative mt-[-0.50px] font-h2 font-[number:var(--h2-font-weight)] text-white text-[length:var(--h2-font-size)] text-right tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)] p-0">
                                {row.ganhos}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-white py-4"
                            >
                              Nenhum downline encontrado
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <Pagination className="inline-flex items-end justify-end gap-1 relative flex-[0_0_auto] mb-[-11.38px] mt-4">
                      <PaginationContent className="flex items-center gap-1">
                        <PaginationItem>
                          <PaginationLink
                            className={`inline-flex min-w-8 h-8 items-center justify-center gap-2.5 p-2 relative flex-[0_0_auto] rounded-lg text-white hover:bg-greyscale-70 ${
                              currentPage === 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              currentPage > 1 &&
                              handlePageChange(currentPage - 1)
                            }
                          >
                            <div className="relative w-fit mt-[-3.50px] mb-[-1.50px] font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                              Anterior
                            </div>
                          </PaginationLink>
                        </PaginationItem>

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

                        <PaginationItem>
                          <PaginationLink
                            className={`inline-flex min-w-8 h-8 items-center justify-center gap-2.5 p-2 relative flex-[0_0_auto] rounded-lg text-white hover:bg-greyscale-70 ${
                              currentPage === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              currentPage < totalPages &&
                              handlePageChange(currentPage + 1)
                            }
                          >
                            <div className="relative w-fit mt-[-3.50px] mb-[-1.50px] font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                              Próxima
                            </div>
                          </PaginationLink>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
