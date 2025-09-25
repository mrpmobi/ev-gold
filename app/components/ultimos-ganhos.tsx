"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { authManager } from "@/lib/auth";
import { API_BASE_URL, apiService } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/formatters";

interface WalletRecord {
  id: number;
  valor: string;
  data: string;
}

export function UltimosGanhos() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<WalletRecord[]>([]);

  async function fetchUltimosGanhos() {
    const token = authManager.getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiService.getGanhos(token);
      if (res.success && res.data) {
        setNotifications(res.data.extrato.slice(0, 6));
      }
    } catch (error) {
      //console.error("Erro ao carregar dados do usuário:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchUltimosGanhos()}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="bg-primaryblack hover:bg-primary text-greyscale-70 hover:text-primaryblack"
        >
          <Bell className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="rounded-lg border-[#121212] bg-[#121212]"
        side={"bottom"}
        align="center"
      >
        <Card className="bg-[#121212] border border-gray-800">
          <CardHeader>
            <CardTitle className="flex justify-center text-white">
              Últimos Ganhos
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto p-0">
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <div className="loader border-4 border-gray-700 border-t-4 border-t-white rounded-full w-6 h-6 animate-spin"></div>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 hover:bg-gray-900 cursor-pointer border-b border-gray-800 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">+{n.valor}</span>
                    <span className="text-gray-400 text-sm">
                      {formatDate(n.data)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-400 text-center">
                Nenhum registro encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
