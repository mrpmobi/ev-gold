"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import LoginComponent from "./components/login";
import DashboardComponent from "./components/dashboard";
import CadastroComponent from "./components/cadastro";
import { authManager } from "@/lib/auth";
import type { User } from "./lib/api";
import { apiService } from "@/lib/api";

type AppState = "login" | "dashboard" | "cadastro" | "maintenance";

const MAINTENANCE_MODE = false;

export default function HomePage() {
  const [userEmail, setUserEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppState>("login");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const refreshToken = async (token: string) => {
    try {
      const refreshResult = await apiService.refresh(token);
      if (refreshResult.success && refreshResult.data) {
        return refreshResult.data;
      }
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      throw error;
    }
  };

  const logout = async (token: string) => {
    try {
      const res = await apiService.logout(token);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (MAINTENANCE_MODE) {
      setIsCheckingAuth(false);
      setCurrentView("maintenance");
      return;
    }

    const checkAuth = async () => {
      try {
        const auth = authManager.getAuth();

        if (auth?.user?.id && auth?.token) {
          const refresh = await refreshToken(auth.token);

          if (refresh) {
            authManager.saveAuth(auth.user, refresh, auth.expires_in, auth.token_type, auth.terms_accepted);
            setUserEmail(auth.user.email);
            setCurrentUser(auth.user);
            setCurrentView("dashboard");
          } else {
            throw new Error("Falha na renovação do token");
          }
        } else {
          setCurrentView("login");
          authManager.clearAuth();
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setCurrentView("login");
        authManager.clearAuth();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // 🔨 Componente da Página de Manutenção
  const MaintenancePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sistema em Manutenção</h1>
          <p className="text-gray-300 mb-4">
            Estamos realizando uma manutenção programada para melhorar nossos serviços.
            O sistema voltará ao normal em breve.
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-gray-500 text-sm">
            <p>Para urgências, entre em contato:</p>
            <p className="text-yellow-400 font-semibold">suporte@mrpgold.com.br</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (MAINTENANCE_MODE) {
    return (
      <>
        <Head>
          <title>Gold MRP - Em Manutenção</title>
        </Head>
        <MaintenancePage />
      </>
    );
  }

  const handleLogin = (email: string, loginData: User) => {
    setUserEmail(email);
    setCurrentUser(loginData);
    setUserData(loginData);
    setCurrentView("dashboard");

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "CompleteRegistration");
    }
  };

  const handleLogout = async (token: string) => {
    try {
      await logout(token);
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      authManager.clearAuth();
      setCurrentView("login");
      setUserEmail("");
      setCurrentUser(null);
      setUserData(null);
    }
  };

  const handleGoToCadastro = () => {
    setCurrentView("cadastro");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleCadastroSuccess = (userData: User) => {
    setUserEmail(userData.email);
    setCurrentUser(userData);
    setCurrentView("dashboard");

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }
  };

  return (
    <>
      <Head>
        <title>Gold MRP</title>
      </Head>

      <div id="root">
        {currentView === "login" && (
          <LoginComponent
            onLogin={handleLogin}
            onGoToCadastro={handleGoToCadastro}
          />
        )}
        {currentView === "dashboard" && (
          <DashboardComponent
            userEmail={userEmail}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
        {currentView === "cadastro" && (
          <CadastroComponent
            onCadastroSuccess={handleCadastroSuccess}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </div>
    </>
  );
}