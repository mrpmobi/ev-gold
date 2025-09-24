"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import LoginComponent from "./components/login";
import DashboardComponent from "./components/dashboard";
import CadastroComponent from "./components/cadastro";
import { authManager } from "./lib/auth";
import type { User } from "./lib/api";
import { apiService } from "@/lib/api";

type AppState = "login" | "dashboard" | "cadastro";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppState>("login"); // Estado inicial sempre login
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Novo estado para controlar a verificação

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
    const checkAuth = async () => {
      try {
        const auth = authManager.getAuth();

        if (auth?.user?.id && auth?.token) {
          // Tenta renovar o token apenas se existir auth válida
          const refresh = await refreshToken(auth.token);

          if (refresh) {
            authManager.saveAuth(auth.user, refresh);
            setUserEmail(auth.user.email);
            setCurrentUser(auth.user);
            setCurrentView("dashboard");
          } else {
            throw new Error("Falha na renovação do token");
          }
        } else {
          // Não há auth válida, vai para login
          setCurrentView("login");
          authManager.clearAuth();
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setCurrentView("login");
        authManager.clearAuth();
      } finally {
        setIsCheckingAuth(false); // Finaliza a verificação
      }
    };

    checkAuth();
  }, []);

  // Renderiza loading enquanto verifica a autenticação
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogin = (email: string, loginData: User) => {
    setUserEmail(email);
    setCurrentUser(loginData);
    setUserData(loginData);
    setCurrentView("dashboard");

    // Tracking do Meta Pixel para login
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

    // Tracking do Meta Pixel para cadastro
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }
  };

  return (
    <>
      <Head>
        <title>Pré-cadastro MRP Mobi</title>
        {/* ... resto do head ... */}
      </Head>

      {/* ... resto do meta pixel ... */}

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
