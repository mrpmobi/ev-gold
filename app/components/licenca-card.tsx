import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types/profile";
import { toast } from "sonner";
import { authManager } from "@/lib/auth";
import { apiService } from "@/lib/api";
import { LicenceStatus } from "@/types/licence";


interface LicencaCardProps {
  currentUser: User;
  status: LicenceStatus;
  setStatus: (status: LicenceStatus) => void;
}

export function LicencaCard({
  currentUser,
  status,
  setStatus,
}: LicencaCardProps) {
  const [loading, setLoading] = useState(false);
  const [linkPagamento, setLinkPagamento] = useState("");

  useEffect(() => {
    const fetchLicencaAtiva = async () => {
      const token = authManager.getToken();
      if (!token) {
        toast.error("Token de autenticação não encontrado.");
        return;
      }

      setLoading(true);
      try {
        const result = await apiService.getAtivo(token);

        if (!result.success) {
          toast.error(result.message || "Erro ao obter link de pagamento.");
          return;
        }

        if (result.success && result.data) {
          if (result.data.ativo) {
            setStatus("ATIVA");
          } else {
            setStatus("PENDENTE");
          }
        }
      } catch (err) {
        toast.error("Erro de rede. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchLicencaAtiva();
  }, []);

  useEffect(() => {
    const fetchLinkLicenca = async () => {
      const token = authManager.getToken();
      if (!token) {
        toast.error("Token de autenticação não encontrado.");
        return;
      }

      setLoading(true);
      try {
        const result = await apiService.ativarLicenca(token, currentUser.id);

        if (result.success && result.data?.init_point) {
          setLinkPagamento(result.data.init_point);
        } else {
          toast.error(result.message || "Erro ao obter link de pagamento.");
        }
      } catch (err) {
        toast.error("Erro de rede. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    if (status === "PENDENTE") {
      fetchLinkLicenca();
    }
  }, [status]);

  const handleClick = async () => {
    window.open(linkPagamento);
  };

  const statusStyles = {
    PENDENTE: {
      circleColor: "bg-yellow-500",
    },
    ATIVA: {
      circleColor: "bg-green-500",
    },
    "": {
      circleColor: "bg-gray-500",
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
          <span className="font-medium">
            {loading ? "Carregando..." : status}
          </span>
        </div>
        <Button
          className={`${(loading || status === "ATIVA") && "hidden"}`}
          onClick={handleClick}
        >
          Ativar Licença
        </Button>
      </CardContent>
    </Card>
  );
}
