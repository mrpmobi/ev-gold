"use client";
import { useState, useEffect } from "react";
import { type User, type Downline, apiService } from "@/lib/api";
import { authManager } from "@/lib/auth";
import { HeaderPanel } from "./header-panel";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SaldoCard } from "./saldo-card";
import { PatrociniosCard } from "./patrocinios-card";
import { Redes } from "./redes";
import { Extrato } from "./extrato";
import { Perfil } from "./perfil";
import { LicencaCard } from "./licenca-card";
import { LinkCard } from "./link-card";
import { LicenceStatus } from "@/types/licence";
import { Saques } from "./saques";
import { Banner } from "./banner";

interface DashboardComponentProps {
  userEmail: string;
  onLogout: (token: string) => void;
  currentUser: User | null;
}

export default function DashboardComponent({
  onLogout,
  currentUser,
}: DashboardComponentProps) {
  const [userData, setUserData] = useState<User | null>(currentUser);
  const [diretos, setDiretos] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const [saldo, setSaldo] = useState("0.00");
  const [downlines, setDownlines] = useState<Downline[]>([]);
  const [downlinesAllCount, setDownlinesAllCount] = useState<number>(0);
  const urlBase = window.location.origin;
  const linkConvite = `${urlBase}/register/${currentUser?.id || 0}`;
  const [licenceStatus, setLicenceStatus] = useState<LicenceStatus>("");

  useEffect(() => {
    const fetchTotalPatrocinios = async () => {
      try {
        const auth = authManager.getAuth();

        if (auth?.token) {
          const res = await apiService.getTotalPatrocinios(auth.token);

          if (res && res.data) {
            setDownlinesAllCount(parseInt(res.data));
          } else {
            throw new Error("Falha ao obter total de patrocinios");
          }
        } else {
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
      }
    };

    fetchTotalPatrocinios();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const token = authManager.getToken();
    if (!token) return;

    const fetchDiretos = async () => {};

    fetchDiretos();
  }, [currentUser]);

  useEffect(() => {
    const token = authManager.getToken();
    if (!token || !currentUser) return;

    const fetchDownlines = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("nivel", "1");

        const res = await apiService.getUserDownlines(token, queryParams);
        if (res.success && res.data) {
          setDownlines(res.data.downlines);
          const somaTotal = Object.values(res.data.contagem_por_nivel).reduce(
            (total, valor) => total + valor,
            0
          );
        }
      } catch (error) {
        //console.error("Erro ao carregar dados do usuário:", error);
        throw error;
      }
    };

    fetchDownlines();
  }, [currentUser]);

  useEffect(() => {
    //setSaldo("Carregando");
    const token = authManager.getToken();
    if (!token || !currentUser) return;
    const fetchSaldo = async () => {
      try {
        const response = await apiService.getSaldo(token);
        if (response.success && response.data) {
          setSaldo(response.data.balance);
        }
      } catch (error) {}
    };

    fetchSaldo();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.nivel !== undefined) {
      const downlinesDiretos = downlines.filter(
        (user) => user.nivel_relativo === currentUser.nivel
      ).length;
      setDiretos(downlinesDiretos);
    }
    setIsLoadingData(false);
  }, [currentUser, downlines]);

  const handleLogout = () => {
    const token = authManager.getToken();
    if (token) onLogout(token);
  };

  return (
    <div className="bg-[#1D1D1D] flex flex-col justify-center items-start p-4 md:p-6">
      <SidebarProvider>
        <AppSidebar setCurrentPage={setCurrentPage} />
        <main className="flex-1 w-full">
          <HeaderPanel
            name={userData?.name || currentUser?.name || "Carregando..."}
            handleLogout={handleLogout}
            setCurrentPage={setCurrentPage}
            licenceStatus={licenceStatus}
          />
          <div
            className="pt-[80px] pb-[10px] flex flex-col items-start gap-4 md:gap-6 px-0 relative self-stretch w-full 
  flex-[0_0_auto] border-b [border-bottom-style:solid] border-transparent 
  [border-image:linear-gradient(90deg,rgba(255,233,100,0)_0%,hsl(50,98%,64%)_20%,hsl(45,98%,54%)_88%,rgba(255,215,70,0)_100%)_1]"
          ></div>
          {currentPage === "home" && (
            <>
              <div className="flex justify-center w-full">
              <Banner />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-[24px]">
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <SaldoCard saldo={saldo} />
                {currentUser && (
                <LicencaCard
                  currentUser={currentUser}
                  status={licenceStatus}
                  setStatus={setLicenceStatus}
                />
                )}
                <LinkCard linkConvite={linkConvite} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <PatrociniosCard
                downlines={downlines}
                downlinesAllCount={downlinesAllCount}
                setCurrentPage={setCurrentPage}
                />
              </div>
              </div>
            </>
          )}
          {currentPage === "redes" && (
            <>
              <Redes diretos={diretos} downlinesAllCount={downlinesAllCount} />
            </>
          )}
          {currentPage === "extrato" && (
            <>
              <Extrato saldo={saldo} />
            </>
          )}
          {currentPage === "perfil" && userData && (
            <>
              <Perfil user={userData} setUser={setUserData} />
            </>
          )}
          {currentPage === "saques" && userData && (
            <>
              <Saques />
            </>
          )}
        </main>
      </SidebarProvider>
    </div>
  );
}
