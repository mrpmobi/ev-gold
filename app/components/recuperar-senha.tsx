"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, Check, RefreshCw } from "lucide-react";
import { API_BASE_URL, apiService } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelInput } from "./label-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";

interface RecuperarSenhaProps {
  setCardView: (view: string) => void;
}

export default function RecuperarSenha({ setCardView }: RecuperarSenhaProps) {
  const [activeStep, setActiveStep] = useState(1);
  const stepData = [1, 2, 3].map((number) => ({
    number,
    isActive: number === activeStep,
  }));
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [token, setToken] = useState("123456");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState([
    {
      id: 1,
      text: "Acima de 8 caracteres",
      isValid: false,
      validator: (password: string) => password.length >= 8,
      icon: AlertCircle,
    },
    {
      id: 2,
      text: "Número",
      isValid: false,
      validator: (password: string) => /\d/.test(password),
      icon: AlertCircle,
    },
    {
      id: 3,
      text: "Letra maiúscula",
      isValid: false,
      validator: (password: string) => /[A-Z]/.test(password),
      icon: AlertCircle,
    },
    {
      id: 4,
      text: "Letra minúscula",
      isValid: false,
      validator: (password: string) => /[a-z]/.test(password),
      icon: AlertCircle,
    },
    {
      id: 5,
      text: "Símbolo especial (Ex: !@#%$)",
      isValid: false,
      validator: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      icon: AlertCircle,
    },
  ]);

  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "novaSenha") {
        const updatedRequirements = passwordRequirements.map((req) => ({
          ...req,
          isValid: req.validator(value),
          icon: req.validator(value) ? Check : AlertCircle,
        }));

        setPasswordRequirements(updatedRequirements);
      }

      if (
        (name === "novaSenha" && newData.confirmarSenha) ||
        (name === "confirmarSenha" && newData.novaSenha)
      ) {
        setShowPasswordMismatch(newData.novaSenha !== newData.confirmarSenha);
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allRequirementsMet = passwordRequirements.every((req) => req.isValid);
    const passwordsMatch = formData.novaSenha === formData.confirmarSenha;

    if (allRequirementsMet && passwordsMatch) {
      try {
        const response = await fetch(`${API_BASE_URL}/otp/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
            new_password: formData.novaSenha,
            new_password_confirmation: formData.confirmarSenha,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setCardView("login");
        } else {
          // Aqui você captura a mensagem de erro da API
          //console.log(data.message);
          setErrors({ api: data.message || "Erro ao alterar senha" });
        }
      } catch (error) {
        //console.error("Erro ao alterar senha:", error);
      }
    } else {
      //console.log("Por favor, atenda a todos os requisitos de senha.");
    }
  };

  const allRequirementsMet = passwordRequirements.every((req) => req.isValid);
  const passwordsMatch = formData.novaSenha === formData.confirmarSenha;
  const canSubmit = allRequirementsMet && passwordsMatch;
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSolicitarNovoCodigo = async () => {
    if (resendCooldown > 0) return; // já está no cooldown

    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Tempo de 45 segundos para poder solicitar um novo código de acesso
        setResendCooldown(45);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrors({ api: data.message || "Erro ao solicitar novo código" });
      }
    } catch (error) {
      setErrors({ api: "Erro de conexão com o servidor!" });
    }
  };
  const handleInputChange = (value: string) => {
    setEmail(value);
    if (errors) {
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.includes("@") && activeStep === 1)
      newErrors.email = "E-mail inválido";
    if (!email.includes(".") && activeStep === 1)
      newErrors.email = "E-mail inválido";
    return newErrors;
  };

  const [cooldown, setCooldown] = useState(0);

  const handleContinuar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setErrors({});
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setActiveStep(2);

        // inicia cooldown de 45s
        setCooldown(45);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrors({ api: data.message || "Erro ao solicitar OTP" });
      }
    } catch (error) {
      setErrors({ api: "Erro de conexão com o servidor!" });
    }
  };

  async function handleOTP(value: string) {
    setOtp(value);
    if (value.length === 6) {
      try {
        const response = await fetch(`${API_BASE_URL}/otp/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: value,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setActiveStep((prev) => prev + 1);
        } else {
          setErrors({ otp: data.message || "Erro ao validar OTP" });
        }
      } catch (errors) {
        setErrors({ api: "Erro de conexão com o servidor!" });
      }

      //if (value === token) {
      //  setActiveStep((prev) => prev + 1);
      //} else {
      //  setErrors({ otp: "Token inválido. Verifique o e-mail e tente novamente." });
      //}
    }
  }

  return (
    <Card className="w-full max-w-[400px] bg-[#ffffff0d] rounded-2xl border border-solid border-greyscale-70 backdrop-blur-[5.85px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5.85px)_brightness(100%)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-white text-base font-h2">
          Recuperação de senha
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8 py-2 space-y-6">
        <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
          {stepData.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-2.5 px-0 py-1 relative flex-1 grow border-b [border-bottom-style:solid] ${
                step.isActive
                  ? "bg-[#fff12a1a] border-primary"
                  : "border-greyscale-70"
              }`}
            >
              <div
                className={`relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)] ${
                  step.isActive ? "text-white" : "text-greyscale-50"
                }`}
              >
                {step.number}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {activeStep === 1 && (
            <div className="space-y-6 w-full">
              <div className="space-y-4 w-full">
                <LabelInput
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => handleInputChange(e.target.value)}
                  label="E-mail"
                  type="email"
                />
                {errors["email"] && (
                  <p className="text-sm text-red-500 mt-1">{errors["email"]}</p>
                )}
                {errors["api"] && (
                  <p className="text-sm text-red-500 mt-1">{errors["api"]}</p>
                )}
                <Button
                  type="button"
                  onClick={handleContinuar}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primaryblack font-h3"
                  disabled={cooldown > 0} // desativa enquanto estiver no cooldown
                >
                  {cooldown > 0 ? `Aguarde ${cooldown}s` : "Continuar"}
                  {!cooldown && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
              <div className="flex justify-between mt-4">
                {/* Botão Voltar / Sair */}
                <Button
                  type="button"
                  onClick={() => setCardView("login")} // volta para login
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6 w-full">
              <div className="flex-col items-center gap-1 flex relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative self-stretch mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-40 text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                  Preencha o campo abaixo com o token enviado para o e-mail:
                </div>

                <div className="relative w-fit font-h2 font-[number:var(--h2-font-weight)] text-white text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                  {email}
                </div>
                <div className="relative self-stretch mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-40 text-[length:var(--h3-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                  (Cheque sua caixa de spam/lixo eletrônico)
                </div>
              </div>

              <div className="flex-col items-start gap-4 flex relative self-stretch w-full flex-[0_0_auto]">
                {errors["api"] && (
                  <p className="text-sm text-red-500 mt-1">{errors["api"]}</p>
                )}
                <div className="items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOTP}
                    autoFocus
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="self-stretch border-greyscale-30 flex w-[49.33px] items-center justify-center gap-2 px-4 py-3 relative bg-primarywhite rounded-sm border border-solid font-h1 font-[number:var(--h1-font-weight)] text-primaryblack text-[length:var(--h1-font-size)] leading-[var(--h1-line-height)] tracking-[var(--h1-letter-spacing)] [font-style:var(--h1-font-style)]"
                      />
                      <InputOTPSlot
                        index={1}
                        className="self-stretch border-greyscale-30 flex w-[49.33px] items-center justify-center gap-2 px-4 py-3 relative bg-primarywhite rounded-sm border border-solid font-h1 font-[number:var(--h1-font-weight)] text-primaryblack text-[length:var(--h1-font-size)] leading-[var(--h1-line-height)] tracking-[var(--h1-letter-spacing)] [font-style:var(--h1-font-style)]"
                      />
                      <InputOTPSlot
                        index={2}
                        className="self-stretch border-greyscale-30 flex w-[49.33px] items-center justify-center gap-2 px-4 py-3 relative bg-primarywhite rounded-sm border border-solid font-h1 font-[number:var(--h1-font-weight)] text-primaryblack text-[length:var(--h1-font-size)] leading-[var(--h1-line-height)] tracking-[var(--h1-letter-spacing)] [font-style:var(--h1-font-style)]"
                      />
                      <InputOTPSlot
                        index={3}
                        className="self-stretch border-greyscale-30 flex w-[49.33px] items-center justify-center gap-2 px-4 py-3 relative bg-primarywhite rounded-sm border border-solid font-h1 font-[number:var(--h1-font-weight)] text-primaryblack text-[length:var(--h1-font-size)] leading-[var(--h1-line-height)] tracking-[var(--h1-letter-spacing)] [font-style:var(--h1-font-style)]"
                      />
                      <InputOTPSlot
                        index={4}
                        className="self-stretch border-greyscale-30 flex w-[49.33px] items-center justify-center gap-2 px-4 py-3 relative bg-primarywhite rounded-sm border border-solid font-h1 font-[number:var(--h1-font-weight)] text-primaryblack text-[length:var(--h1-font-size)] leading-[var(--h1-line-height)] tracking-[var(--h1-letter-spacing)] [font-style:var(--h1-font-style)]"
                      />
                      <InputOTPSlot
                        index={5}
                        className="self-stretch border-greyscale-30 flex w-[49.33px] items-center justify-center gap-2 px-4 py-3 relative bg-primarywhite rounded-sm border border-solid font-h1 font-[number:var(--h1-font-weight)] text-primaryblack text-[length:var(--h1-font-size)] leading-[var(--h1-line-height)] tracking-[var(--h1-letter-spacing)] [font-style:var(--h1-font-style)]"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {/* Botão Solicitar Novo Código */}
                <Button
                  type="button"
                  onClick={handleContinuar}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primaryblack font-h3"
                  disabled={cooldown > 0}
                >
                  {cooldown > 0
                    ? `Aguarde ${cooldown}s`
                    : "Solicitar novo código"}
                  {!cooldown && <RefreshCw className="w-4 h-4 ml-2" />}
                </Button>
                <div className="flex flex-row items-center justify-between w-full">
                  {/* Botão Voltar */}
                  <Button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setActiveStep((prev) => Math.max(prev - 1, 1));
                    }}
                    className="p-1 text-white hover:text-gray-300 bg-transparent"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </div>

                {errors["otp"] && (
                  <p className="text-sm text-red-500 mt-1">{errors["otp"]}</p>
                )}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="flex flex-col gap-6 w-full">
              {errors["api"] && (
                <p className="text-sm text-red-500 mt-1">{errors["api"]}</p>
              )}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <LabelInput
                    id="novaSenha"
                    name="novaSenha"
                    value={formData.novaSenha}
                    onChange={handleChange}
                    label="Nova senha"
                    type="password"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <LabelInput
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    label="Confirmar nova senha"
                    type="password"
                  />

                  {showPasswordMismatch && formData.confirmarSenha && (
                    <div className="flex items-center gap-1 mt-1 text-supportred">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">As senhas não coincidem</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {passwordRequirements.map((requirement) => {
                    const IconComponent = requirement.icon;
                    return (
                      <div
                        key={requirement.id}
                        className="flex items-center gap-2"
                      >
                        <IconComponent
                          className={`w-4 h-4 ${
                            requirement.isValid
                              ? "text-supportgreen"
                              : "text-supportred"
                          }`}
                        />
                        <span
                          className={`font-p-1 font-[number:var(--p-1-font-weight)] text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)] ${
                            requirement.isValid
                              ? "text-supportgreen"
                              : "text-white"
                          }`}
                        >
                          {requirement.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-0">
                <Button
                  type="submit"
                  className="h-11 w-full bg-primary hover:bg-primary/90 text-primaryblack font-h3 font-[number:var(--h3-font-weight)] text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] [font-style:var(--h3-font-style)] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!canSubmit}
                >
                  Alterar senha
                </Button>
                {/* Botão Voltar */}
                <Button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setActiveStep((prev) => Math.max(prev - 1, 1));
                  }}
                  className="p-1 text-white hover:text-gray-300 bg-transparent"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
