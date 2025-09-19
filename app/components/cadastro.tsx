"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  CreditCard,
  UserCheck,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { apiService } from "@/lib/api";
import { authManager } from "@/lib/auth";
import {
  generateUUID,
  generateDeviceToken,
  cleanPhone,
  validateCPF,
} from "@/lib/utils";

interface CadastroComponentProps {
  patrocinadorId?: string;
  patrocinadorNome?: string;
  onCadastroSuccess: (userData: any) => void;
  onBackToLogin: () => void;
}

export default function CadastroComponent({
  patrocinadorId = "14",
  patrocinadorNome = "Jieff Cavalcanti Neves",
  onCadastroSuccess,
  onBackToLogin,
}: CadastroComponentProps) {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    celular: "",
    cpf: "",
    patrocinador: patrocinadorNome,
    senha: "",
    confirmarSenha: "",
    aceitoTermos: false,
  });

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCelular = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.celular.trim()) {
      newErrors.celular = "Celular é obrigatório";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não coincidem";
    }

    if (!formData.aceitoTermos) {
      newErrors.aceitoTermos = "Você deve aceitar os termos de uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiService.register({
        name: formData.nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        pai: Number.parseInt(patrocinadorId || "1"),
      });

      if (result.success && result.data && result.access_token) {
        // Salvar dados de autenticação
        authManager.saveAuth(
          result.data.user || result.data,
          result.access_token,
          result.data.expires_in,
          result.data.token_type
        );

        // Tracking do Meta Pixel
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Lead");
        }

        onCadastroSuccess(result.data.user || result.data);
      } else {
        setErrors({
          submit: result.message || "Erro no cadastro. Tente novamente.",
        });
      }
    } catch (error) {
      setErrors({
        submit: "Erro de conexão. Verifique sua internet e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBackToLogin}
            className="absolute top-4 left-4 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-white text-lg font-medium mb-6">
            Sistema de Consultores Independentes
          </h1>

          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-white text-xl font-semibold mb-2">
            Pré-cadastro MRP Mobi
          </h2>
          <p className="text-slate-400 text-sm mb-1">Você foi convidado por:</p>
          <p className="text-slate-500 text-xs mb-1">ID: {patrocinadorId}</p>
          <p className="text-orange-400 font-medium">{patrocinadorNome}</p>
        </div>

        {/* Formulário */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome Completo */}
              <div>
                <Label
                  htmlFor="nomeCompleto"
                  className="text-slate-300 text-sm"
                >
                  Nome Completo *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="nomeCompleto"
                    type="text"
                    placeholder="João Silva Santos"
                    value={formData.nomeCompleto}
                    onChange={(e) =>
                      handleInputChange("nomeCompleto", e.target.value)
                    }
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                {errors.nomeCompleto && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.nomeCompleto}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-slate-300 text-sm">
                  Seu melhor email *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="test@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Celular */}
              <div>
                <Label htmlFor="celular" className="text-slate-300 text-sm">
                  Celular *
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="celular"
                    type="tel"
                    placeholder="(99) 99999-9999"
                    value={formData.celular}
                    onChange={(e) => {
                      const formatted = formatCelular(e.target.value);
                      handleInputChange("celular", formatted);
                    }}
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                </p>
                {errors.celular && (
                  <p className="text-red-400 text-xs mt-1">{errors.celular}</p>
                )}
              </div>

              {/* CPF */}
              <div>
                <Label htmlFor="cpf" className="text-slate-300 text-sm">
                  CPF *
                </Label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      if (formatted.length <= 14) {
                        handleInputChange("cpf", formatted);
                      }
                    }}
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  Formato: XXX.XXX.XXX-XX ou XXX XXXXX XX ou XXXXXXXXXXX
                </p>
                {errors.cpf && (
                  <p className="text-red-400 text-xs mt-1">{errors.cpf}</p>
                )}
              </div>

              {/* Patrocinador */}
              <div>
                <Label
                  htmlFor="patrocinador"
                  className="text-slate-300 text-sm"
                >
                  Patrocinador *
                </Label>
                <div className="relative mt-1">
                  <UserCheck className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="patrocinador"
                    type="text"
                    value={formData.patrocinador}
                    readOnly
                    className="pl-10 bg-slate-600 border-slate-500 text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <Label htmlFor="senha" className="text-slate-300 text-sm">
                  Senha *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="senha"
                    type={showSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                    disabled={isLoading}
                  >
                    {showSenha ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.senha && (
                  <p className="text-red-400 text-xs mt-1">{errors.senha}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <Label
                  htmlFor="confirmarSenha"
                  className="text-slate-300 text-sm"
                >
                  Confirmar Senha *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmarSenha"
                    type={showConfirmarSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={(e) =>
                      handleInputChange("confirmarSenha", e.target.value)
                    }
                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                    disabled={isLoading}
                  >
                    {showConfirmarSenha ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmarSenha}
                  </p>
                )}
              </div>

              {/* Termos */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="termos"
                  checked={formData.aceitoTermos}
                  onCheckedChange={(checked) =>
                    handleInputChange("aceitoTermos", checked as boolean)
                  }
                  disabled={isLoading}
                  className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label
                  htmlFor="termos"
                  className="text-slate-300 text-sm leading-5"
                >
                  Aceito os termos de uso
                </Label>
              </div>
              {errors.aceitoTermos && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.aceitoTermos}
                </p>
              )}
              {errors.submit && (
                <p className="text-red-400 text-xs mt-1">{errors.submit}</p>
              )}

              {/* Botão de Cadastro */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>

            {/* Link para Login */}
            <div className="text-center mt-6">
              <button
                onClick={onBackToLogin}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                disabled={isLoading}
              >
                Já tem uma conta? Faça login aqui
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
