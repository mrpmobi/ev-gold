import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types/profile";
import { toast } from "sonner";
import { authManager } from "@/lib/auth";
import { apiService } from "@/lib/api";

type Status = "PENDENTE" | "ATIVA";

interface LicencaCardProps {
  currentUser: User;
}

export function LicencaCard({ currentUser }: LicencaCardProps) {
  const [status, setStatus] = useState<Status>("PENDENTE");

  const handleClick = async () => {
    const token = authManager.getToken();
    if (!token) return;
    try {
      const result = await apiService.ativarLicenca(token, currentUser.id);

      if (result.success && result.data?.init_point) {
        // Open the payment link in a new window/tab
        window.open(result.data.init_point, "_blank", "noopener,noreferrer");
      } else {
        toast.error(result.message || "Erro ao obter link de pagamento.");
      }
    } catch (err) {
      toast.error("Erro de rede. Tente novamente mais tarde.");
    }
  };

  const statusStyles = {
    PENDENTE: {
      circleColor: "bg-yellow-500",
    },
    ATIVA: {
      circleColor: "bg-green-500",
    },
  };

  const currentStatusStyle = statusStyles[status];

  return (
    <Card className="flex flex-col items-start p-6 gap-2 bg-[#121212] rounded-lg flex-none flex-grow-0 border-0 h-auto min-h-[128px]">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          <CardTitle className="whitespace-nowrap font-medium text-[#6C6C6C]">
            Licença
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-4 w-auto mt-4 md:mt-0">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-opacity-10 border-[#6C6C6C] border-opacity-30">
          <div
            className={`
            w-3 h-3 rounded-full 
            ${currentStatusStyle.circleColor}
          `}
          ></div>
          <span className="font-medium">{status}</span>
        </div>
        <Button onClick={handleClick}>Ativar Licença</Button>
      </CardContent>
    </Card>
  );
}
