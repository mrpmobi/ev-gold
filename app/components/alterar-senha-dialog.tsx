"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Check, CheckCircle, X } from "lucide-react";
import React, { useState } from "react";
import { Lock } from "lucide-react";
import { LabelInput } from "./label-input";
import { API_BASE_URL } from "@/lib/api";
import { authManager } from "../lib/auth";

export function AlterarSenhaDialog() {
  const [formData, setFormData] = useState({
    senhaAtual: "",
    confirmarSenha: "",
    novaSenha: "",
  });

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
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [resultView, setResultView] = useState(false);

  const handleClose = () => {
    setResult(null);
    setResultView(false);
  };

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

  const fetchSubmitPassword = async (data: {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/office/user/change_password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authManager.getToken()}`,
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      setResultView(true);

      if (!response.ok) {
        setResult("error");
        throw new Error(responseData.message || "Falha ao alterar senha");
      }

      setResult("success");
      return responseData;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allRequirementsMet = passwordRequirements.every((req) => req.isValid);

    const passwordsMatch = formData.novaSenha === formData.confirmarSenha;

    if (allRequirementsMet && passwordsMatch) {
      fetchSubmitPassword({
        old_password: formData.senhaAtual,
        new_password: formData.novaSenha,
        new_password_confirmation: formData.confirmarSenha,
      });
    }
  };

  const allRequirementsMet = passwordRequirements.every((req) => req.isValid);
  const passwordsMatch = formData.novaSenha === formData.confirmarSenha;
  const canSubmit = allRequirementsMet && passwordsMatch && formData.senhaAtual;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-greyscale-90 rounded-sm border border-solid border-greyscale-80 h-auto">
          <span className="font-h3 font-[number:var(--h3-font-weight)] text-white text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
            Redefinir senha
          </span>
          <Lock className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[559px] p-10 bg-primaryblack border-0 rounded-xl">
        <DialogHeader className="flex flex-row items-center justify-between w-full mb-6">
          <DialogTitle className="font-h1 font-[number:var(--h1-font-weight)] text-greyscale-30 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] whitespace-nowrap [font-style:var(--h1-font-style)]">
            Redefinir senha
          </DialogTitle>
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-8 h-8 text-greyscale-30" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        <DialogDescription className="flex flex-col gap-8 w-full">
          {!resultView && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 w-full"
            >
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-2">
                  <LabelInput
                    id="senhaAtual"
                    name="senhaAtual"
                    value={formData.senhaAtual}
                    onChange={handleChange}
                    label="Senha Atual"
                    type="password"
                  />
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f98e30] to-transparent my-2"></div>

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
                    className="h-11 w-full bg-primarymobi hover:bg-primarymobi/90 text-primaryblack font-h3 font-[number:var(--h3-font-weight)] text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] [font-style:var(--h3-font-style)] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canSubmit}
                  >
                    Alterar senha
                  </Button>
                </div>
              </div>
            </form>
          )}

          {resultView && result === "success" && (
            <>
              <div className="flex-col items-center justify-center gap-6 flex relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex-col items-center gap-4 flex relative self-stretch w-full flex-[0_0_auto]">
                  <CheckCircle className="!relative !w-12 !h-12 !aspect-[1] text-supportgreen" />
                  <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative self-stretch mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-supportgreen text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                      Senha alterada com sucesso
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                <DialogClose
                  onClick={handleClose}
                  className="flex h-11 items-center justify-center gap-1 px-4 py-3 relative self-stretch w-full bg-greyscale-90 rounded-sm border border-solid border-greyscale-80 hover:bg-greyscale-80"
                >
                  <div className="relative w-fit font-h3 font-[number:var(--h3-font-weight)] text-primarywhite text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                    Fechar
                  </div>
                </DialogClose>
              </div>
            </>
          )}

          {resultView && result === "error" && (
            <>
              <div className="flex-col items-center justify-center gap-6 flex relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex-col items-center gap-4 flex relative self-stretch w-full flex-[0_0_auto]">
                  <X className="!relative !w-12 !h-12 !aspect-[1] text-supportred" />
                  <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative self-stretch mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-supportred text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                      Erro ao alterar a senha
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                <Button
                  onClick={handleClose}
                  className="flex h-11 items-center justify-center gap-1 px-4 py-3 relative self-stretch w-full bg-greyscale-90 rounded-sm border border-solid border-greyscale-80 hover:bg-greyscale-80"
                >
                  <div className="relative w-fit font-h3 font-[number:var(--h3-font-weight)] text-primarywhite text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                    Tentar novamente
                  </div>
                </Button>
              </div>
            </>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
