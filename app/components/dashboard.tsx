"use client";
import { useState, useEffect } from "react";
import { type User, type Downline } from "@/lib/api";
import { authManager } from "@/lib/auth";
import { HeaderPanel } from "./header-panel";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SaldoCard } from "./saldo-card";
import { Banner } from "./banner";
import { PatrociniosCard } from "./patrocinios-card";
import { DiretosCard } from "./diretos-card";
import { LinkCard } from "./link-card";
import { BaixarAppCard } from "./baixar-app-card";
import { Redes } from "./redes";
import { Extrato } from "./extrato";
import { Perfil } from "./perfil";
import { API_BASE_URL } from "@/lib/api";

interface DashboardComponentProps {
  userEmail: string;
  onLogout: () => void;
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
  const urlBase = window.location.origin;
  const linkConvite = `${urlBase}/register/${currentUser?.id || 0}`;
  const [downlines, setDownlines] = useState<Downline[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const token = authManager.getToken();
    if (!token) return;

    const fetchDiretos = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/user/${currentUser.id}/downlinesCount`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.diretos !== undefined) {
          setDiretos(data.diretos);
        } else {
        }
      } catch (err) {}
    };

    fetchDiretos();
  }, [currentUser]);

  useEffect(() => {
    const token = authManager.getToken();
    if (!token || !currentUser) return;

    const fetchDownlines = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/office/user/downlines-by-filter?limit=3`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.downlines) {
          setDownlines(data.downlines);
        } else {
        }
      } catch (err) {}
    };

    fetchDownlines();
  }, [currentUser]);

  useEffect(() => {
    //setSaldo("Carregando");
    async function fetchSaldo() {
      try {
        const response = await fetch(`${API_BASE_URL}/userwallet-get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authManager.getToken()}`,
          },
        });
        const data = await response.json();
        setSaldo(data.data.amount_balance);
      } catch (error) {}
    }

    fetchSaldo();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.nivel !== undefined) {
      const downlinesDiretos = downlines.filter(
        (user) => user.nivel === currentUser.nivel
      ).length;
      setDiretos(downlinesDiretos);
    }
    setIsLoadingData(false);
  }, [currentUser, downlines]);

  const handleLogout = () => {
    authManager.clearAuth();
    onLogout();
  };

  const [downlinesAllCount, setDownlinesAllCount] = useState<number>(0);

  useEffect(() => {
    const fetchDownlinesCount = async () => {
      try {
        const userId = authManager.getUser()?.id;
        if (!userId) return;

        const token = authManager.getToken();
        if (!token) return;

        const response = await fetch(
          `${API_BASE_URL}/user/${userId}/downlinesAllCount`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erro ao buscar patrocinios");

        const data = await response.json();
        setDownlinesAllCount(data.total ?? 0);
      } catch (error) {}
    };

    fetchDownlinesCount();
  }, []);

  return (
    <div className="bg-[#1D1D1D] flex flex-col justify-center items-start p-4 md:p-6">
      <SidebarProvider>
        <AppSidebar setCurrentPage={setCurrentPage} />
        <main className="flex-1 w-full">
          <HeaderPanel
            name={userData?.name || currentUser?.name || "Carregando..."}
            handleLogout={handleLogout}
            setCurrentPage={setCurrentPage}
          />
          <div
            className="pt-[80px] pb-[10px] flex flex-col items-start gap-4 md:gap-6 px-0 relative self-stretch w-full 
  flex-[0_0_auto] border-b [border-bottom-style:solid] border-transparent 
  [border-image:linear-gradient(90deg,rgba(255,233,100,0)_0%,hsl(50,98%,64%)_20%,hsl(45,98%,54%)_88%,rgba(255,215,70,0)_100%)_1]"
          ></div>
          {currentPage === "home" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-[24px]">
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <SaldoCard saldo={saldo} />
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
        </main>
      </SidebarProvider>
    </div>
  );
}
