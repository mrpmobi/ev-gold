"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { apiService } from "@/lib/api";
import { authManager } from "@/lib/auth";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecuperarSenha from "./recuperar-senha";
import { User } from "../lib/api";

interface LoginComponentProps {
  onLogin: (email: string, user: any) => void;
  onGoToCadastro: () => void;
}

export default function LoginComponent({
  onLogin,
  onGoToCadastro,
}: LoginComponentProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [error, setError] = useState("");
  const [cardView, setCardView] = useState("login");

  const loadUserData = async (userId: number, token: string) => {
    setIsLoadingUserData(true);
    try {
      const userResult = await apiService.getUserById(userId, token);
      if (userResult.success && userResult.data) {
        let userData = userResult.data;

        let downlines: User[] = [];
        //if (fetchDownlines) {
        //  const downlinesResult = await apiService.getUserDownlines(userId, token);
        //  downlines = downlinesResult.success ? downlinesResult.data : [];
        //}

        return { userData, downlines };
      }
    } catch (error) {
      //console.error("Erro ao carregar dados do usuário:", error);
      throw error;
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await apiService.login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.data && result.access_token) {
        const userDetailsResult = await apiService.findUserByEmail(
          formData.email,
          result.access_token
        );

        if (userDetailsResult.success && userDetailsResult.data) {
          const actualUser =
            (userDetailsResult.data as any).usuario || userDetailsResult.data;

          if (actualUser && actualUser.id) {
            const userFullData = await loadUserData(
              actualUser.id,
              result.access_token
            );

            authManager.saveAuth(
              actualUser,
              result.access_token,
              result.data.expires_in,
              result.data.token_type
            );

            // Tracking do Meta Pixel
            if (typeof window !== "undefined" && (window as any).fbq) {
              (window as any).fbq("track", "CompleteRegistration");
            }

            onLogin(actualUser.email, {
              ...actualUser,
              ...userFullData,
            });
          } else {
            setError(
              "Erro ao obter dados completos do usuário. Tente novamente."
            );
            authManager.clearAuth();
          }
        } else {
          setError(
            userDetailsResult.message ||
              "Erro ao obter dados do usuário. Tente novamente."
          );
          authManager.clearAuth();
        }
      } else {
        setError(
          result.message || "Email ou senha inválidos. Tente novamente."
        );
      }
    } catch (error) {
      //console.error("Erro no login:", error);
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  return (
    <div className="flex flex-col min-h-screen min-w-screen items-center justify-center gap-4 p-0 relative border-none bg-[#202020]">
      <Image
        width={124}
        height={44}
        className="absolute top-14 md:left-14 aspect-[2.82]"
        alt="Mrp mobi completo"
        src="crown.svg"
      />
      <div className="w-full px-4 md:px-0 inline-flex flex-col items-center justify-center relative flex-[0_0_auto]">
        {cardView === "login" && (
          <Card className="w-full md:w-[400px] h-min-[322px] bg-[#ffffff0d] rounded-2xl border border-solid border-greyscale-70 backdrop-blur-[5.85px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5.85px)_brightness(100%)]">
            <CardHeader className="pb-0">
              <CardTitle className="text-center text-white text-base">
                Acesse sua conta de patrocinador
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 md:px-8 py-6 pt-0 flex items-center justify-center">
              {isLoadingUserData ? (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]"
                >
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="relative self-stretch">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="
                          [font-family:'Montserrat-Regular',Helvetica] font-normal text-primaryblack 
                          text-xs tracking-[0] leading-[18px] overflow-hidden text-ellipsis
                           [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]
                           border-greyscale-50 h-11 items-center gap-2 px-4 py-3 pr-10 w-full bg-white rounded-sm border border-solid"
                      disabled={isLoading}
                    />
                    <Mail className="absolute right-4 top-3 w-4 h-4 text-greyscale-60" />
                  </div>

                  <div className="relative self-stretch">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="[font-family:'Montserrat-Regular',Helvetica] font-normal text-primaryblack 
                          text-xs tracking-[0] leading-[18px] overflow-hidden text-ellipsis
                           [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]
                           border-greyscale-50 h-11 items-center gap-2 px-4 py-3 pr-10 w-full bg-white rounded-sm border border-solid"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-greyscale-60 hover:text-greyscale-50"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                    <Button
                      type="submit"
                      className="h-11 whitespace-nowrap flex items-center gap-2 text-primaryblack rounded-xs self-stretch"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                    <Button
                      onClick={() => setCardView("recuperar")}
                      className="bg-transparent hover:bg-greyscale-80 all-[unset] box-border inline-flex gap-2 items-center justify-center relative flex-[0_0_auto] rounded-sm"
                    >
                      <div className="font-h4 font-[number:var(--h4-font-weight)] relative w-fit mt-[-1.00px] text-white text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] whitespace-nowrap [font-style:var(--h4-font-style)]">
                        Esqueci minha senha
                      </div>
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}
        {cardView === "recuperar" && (
          <RecuperarSenha setCardView={setCardView} />
        )}
      </div>
    </div>
  );
}
