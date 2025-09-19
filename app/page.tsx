"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import LoginComponent from "./components/login";
import DashboardComponent from "./components/dashboard";
import CadastroComponent from "./components/cadastro";
import { authManager } from "./lib/auth";
import type { User } from "./lib/api"; // Importa o tipo User
import { apiService } from "@/lib/api";

type AppState = "login" | "dashboard" | "cadastro";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppState>("login");
  const [userEmail, setUserEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Define o tipo para currentUser
  const [userData, setUserData] = useState<User | null>(null);

  const refreshToken = async (token: string) => {
    try {
      const refreshResult = await apiService.refresh(token);
      if (refreshResult.success && refreshResult.data) {
        return refreshResult.data;
      }
    } catch (error) {
      //console.error("Erro ao carregar dados do usuário:", error);
      throw error;
    } finally {
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const auth = authManager.getAuth();

      if (auth && auth.user && auth.user.id) {
        const refresh = await refreshToken(auth?.token);

        if (refresh) {
          setUserEmail(auth.user.email);
          setCurrentUser(auth.user);
          setCurrentView("dashboard");
        } else {
          setCurrentView("login");
          setUserEmail("");
          setCurrentUser(null);
          authManager.clearAuth();
        }
      } else {
        setCurrentView("login");
        setUserEmail("");
        setCurrentUser(null);
        authManager.clearAuth(); // Garante que dados incompletos sejam limpos
      }
    };

    checkAuth();
  }, []);

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

  const handleLogout = () => {
    authManager.clearAuth();
    setCurrentView("login");
    setUserEmail("");
    setCurrentUser(null);
    setUserData(null);
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
        <meta name="description" content="MRP Mobi" />
        <meta name="author" content="MRP Mobi" />
        <link rel="icon" href="/favicon.ico" />

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '731289790385053');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* OG / Twitter meta */}
        <meta property="og:url" content="https://precadastro.escola.cc" />
        <meta
          property="og:title"
          content="MRP Mobi - Pré-cadastro de Consultores"
        />
        <meta
          property="og:description"
          content="Participe da rede de consultores MRP Mobi!"
        />
        <meta
          property="og:image"
          content="https://precadastro.escola.cc/share.png"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MRP Mobi - Pré-cadastro" />
        <meta
          name="twitter:description"
          content="Venha fazer parte do time MRP Mobi!"
        />
        <meta
          name="twitter:image"
          content="https://precadastro.escola.cc/share.png"
        />
      </Head>

      {/* Meta Pixel noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=731289790385053&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

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
