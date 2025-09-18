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
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WalletRecord {
  id: number;
  value: string;
  created_at: string;
}

export function UltimosGanhos() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<WalletRecord[]>([]);

  async function fetchUltimosGanhos() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/twenty-one-wallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authManager?.getToken()}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Erro ao buscar saldo");
      setNotifications(data.data.wallets || []);
    } catch (error) {
      //console.error("Erro ao carregar saldo:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchUltimosGanhos()}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="bg-primaryblack hover:bg-primarymobi text-greyscale-70 hover:text-primaryblack"
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
            <CardTitle className="flex justify-center text-white">Últimos Ganhos</CardTitle>
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
                    <span className="text-white font-medium">+{n.value}</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(n.created_at).toLocaleDateString()}
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
