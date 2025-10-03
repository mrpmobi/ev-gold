"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCel, formatCpf, formatName } from "@/utils/formatters";
import { validarCPF } from "@/utils/validators";
import { ArrowRight, Check, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE = "https://ti.mrpmobi.com.br";
const TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiM2JmOWM4OTJlODc2ODMyZmYyYTBlZWVhZWY4NTYwYjVmNzJhZDNjMTY5ODAwMmZjM2U1ZjI5YjQ0NjhiMTQ1ZjBmMjFiNWFlOWY3MWQ4ZWQiLCJpYXQiOjE3NTQ5NTY2NTIuNDg0ODcyLCJuYmYiOjE3NTQ5NTY2NTIuNDg0ODc2LCJleHAiOjE3ODY0OTI2NTIuNDgxNDc2LCJzdWIiOiIyNzg5OSIsInNjb3BlcyI6W119.xX4JRFPYY48Wx-6U5femrqVdQkucz8prpdgER_pt_AVF_28ZN7fki-zZTMyn8GSaB_mF39IRcIAo8cz1Ppk87xIcLAb_ENn-8iB4yEb4ICt2MsjZ2pEtTL6DzSaYFTmBAO8X77ygaxGpfy8JHPcoYKhK1LtNcRz5wYzFX-baL7bvopynk8Xy7rBDzmVod4k10QYbEgpyUFRSfgMdoeNcm51rk8-32cuSx_1qwVNU-73P30ewUe90-4cBj-QEkfy6QlwsYX0o4xyFIoX86JxXthkW15m90Lyq2eaKvtM0Tjnmc-cewfV1fVSqeU1_mFhwaRHGRhXKUPQj0V2rA0SL1QIvSPtWcht5McFOg92UKsR21JeFu9YNbBPUQAOKPmY8kLUAbihMObyT1yx_-FZBfPxtxlT5zSWUYsVcUsM-6x5GIIfeAfuZMQNe2DJSjC14P0FCWAUYJCRkMZmptXvRHGB_h5NushGKiaAzMI2cElqelU0nNP474HIPRsv0IN2PGJVbQp48mw63ZgDSrStr0TbsPC8rVPj0r87a_sQwCdfY6b2ikWiuigOdu2SBNDvjxgQw7OfUZYTjIN4Ut8yE5_upP2LgOhRultfIUIrugDjzQXcy-nDvBGYTn9Df89hBw-zVwcIo-1xk4vwWR4S7xBhzIeOK2SyjVLzkIItv0aY";

export default function RegisterPage() {
  const params = useParams();
  const patrocinadorId = Array.isArray(params.patrocinadorId)
    ? params.patrocinadorId[0]
    : params.patrocinadorId;

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [patrocinador, setPatrocinador] = useState<{
    id: number;
    nome: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    password_confirmation: "",
  });
  const [activeStep, setActiveStep] = useState(1);
  const stepData = [1, 2, 3].map((number) => ({
    number,
    isActive: number === activeStep,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [stepFields, SetStepFields] = useState(["name", "cpf"]);

  useEffect(() => {
    if (!patrocinadorId) return;

    fetch(`${API_BASE}/api/v1/user/${patrocinadorId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id && data?.name) {
          setPatrocinador({ id: data.id, nome: data.name });
        } else {
          toast.error("Patrocinador não encontrado.");
        }
      })
      .catch(() => {
        toast.error("Erro ao buscar patrocinador. Verifique o link.");
      });
  }, [patrocinadorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "cpf") {
      newValue = formatCpf(value);
    }

    if (name === "mobile") {
      newValue = formatCel(value);
    }

    if (name === "name") {
      newValue = formatName(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const ativaStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
    switch (stepNumber) {
      case 1:
        SetStepFields(["name", "cpf"]);
        break;
      case 2:
        SetStepFields(["email"]);
        break;
      case 3:
        SetStepFields(["password", "password_confirmation"]);
        break;
    }
  };

  const avancaStep = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Corrija os erros no formulário.");
      return;
    }
    if (activeStep === 1) {
      ativaStep(2);
      return;
    }
    if (activeStep === 2) {
      ativaStep(3);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome obrigatório";
    if (!formData.email.includes("@") && activeStep == 2)
      newErrors.email = "E-mail inválido";
    if (!formData.email.includes(".") && activeStep == 2)
      newErrors.email = "E-mail inválido";
    if (!validarCPF(formData.cpf)) newErrors.cpf = "CPF inválido";
    if (formData.password.length < 8 && activeStep == 3)
      newErrors.password = "Mínimo 8 caracteres";
    if (formData.password_confirmation !== formData.password && activeStep == 3)
      newErrors.password_confirmation = "As senhas não conferem";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Corrija os erros no formulário.");
      return;
    }

    setLoading(true);
    setRegisterError(null);

    // Toast de carregamento
    const loadingToast = toast.loading("Realizando cadastro...");

    try {
      const result = await apiService.register({
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        patrocinador_id: Number.parseInt(patrocinadorId || "1"),
      });

      // Remove o toast de loading
      toast.dismiss(loadingToast);

      if (result.success && result.data) {
        // Toast de sucesso
        toast.success("Cadastro realizado com sucesso! Redirecionando...", {
          duration: 3000,
        });
        setRegisterSuccess("Cadastro realizado com sucesso! Redirecionando...");

        setFormData({
          name: "",
          email: "",
          cpf: "",
          password: "",
          password_confirmation: "",
        });

        // Aguarda um pouco antes de redirecionar para o usuário ver a mensagem de sucesso
        setTimeout(() => {
          router.push("https://ev.mrpgold.com.br/");
        }, 2000);
      } else {
        toast.error(
          result.message || "Erro ao realizar cadastro. Tente novamente.",
          {
            duration: 5000,
          }
        );
        setRegisterError(
          result.message || "Erro ao realizar cadastro. Tente novamente."
        );
        ativaStep(1);
      }
    } catch (err: any) {
      // Remove o toast de loading
      toast.dismiss(loadingToast);

      // Toast de erro de rede
      toast.error(
        err.message ||
          "Erro de conexão. Verifique sua internet e tente novamente.",
        { duration: 5000 }
      );
      setRegisterError(
        err.message ||
          "Erro de conexão. Verifique sua internet e tente novamente."
      );
      ativaStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4 p-6 relative bg-[linear-gradient(180deg,rgba(29,29,29,1)_0%,rgba(15,15,15,1)_100%)]">
      <img
        className="absolute w-[124px] h-11 top-14 left-14 aspect-[2.82]"
        alt="Gold MRP"
        src="/gold-logo.svg"
      />
      <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
        <Card className="w-[400px] min-h-[70px] bg-[#ffffff0d] rounded-2xl border border-solid border-greyscale-70 backdrop-blur-[5.85px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5.85px)_brightness(100%)]">
          <CardContent className="gap-6 px-8 py-10 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-white text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                Cadastro conta de patrocinador
              </div>
            </div>

            <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
              {stepData.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center gap-2.5 px-0 py-1 relative flex-1 grow border-b [border-bottom-style:solid] ${
                    step.isActive ? "bg-[#fffb2a1a]" : "border-greyscale-70"
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

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]"
            >
              {stepFields.map((field) => (
                <div
                  key={field}
                  className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]"
                >
                  {(formData as any)[field] ? (
                    <Label
                      htmlFor={field}
                      className="relative self-stretch mt-[-1.00px] font-p-4 font-[number:var(--p-4-font-weight)] text-greyscale-70 text-[length:var(--p-4-font-size)] tracking-[var(--p-4-letter-spacing)] leading-[var(--p-4-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--p-4-font-style)]"
                    >
                      {
                        {
                          name: "Nome completo",
                          email: "Seu melhor e-mail",
                          cpf: "CPF",
                          password: "Senha",
                          password_confirmation: "Confirmar senha",
                        }[field]
                      }
                    </Label>
                  ) : null}
                  <Input
                    id={field}
                    name={field}
                    type={
                      field.includes("password")
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    placeholder={
                      {
                        name: "Nome completo",
                        email: "Seu melhor e-mail",
                        cpf: "CPF",
                        password: "Senha",
                        password_confirmation: "Confirmar senha",
                      }[field]
                    }
                    autoComplete="off"
                    className="border-greyscale-30 flex h-11 items-center gap-2 px-4 py-3 relative self-stretch w-full bg-primarywhite rounded-sm border border-solid font-h4 font-[number:var(--h4-font-weight)] text-black text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]"
                  />
                  {errors[field] && (
                    <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <Button
                className="
              self-stretch w-full flex items-center justify-center gap-1 px-4 py-3 
              relative flex-[0_0_auto] rounded-sm h-auto"
                type={activeStep === 3 ? "submit" : "button"}
                onClick={avancaStep}
                disabled={loading}
              >
                {loading ? (
                  <div className="relative w-fit mt-[-1.00px] font-h3 font-[number:var(--h3-font-weight)] text-primaryblack text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                    Cadastrando...
                  </div>
                ) : (
                  <>
                    {(activeStep === 1 || activeStep === 2) && (
                      <>
                        <div className="relative w-fit mt-[-1.00px] font-h3 font-[number:var(--h3-font-weight)] text-primaryblack text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                          Continuar
                        </div>
                        <ArrowRight className="!relative !w-4 !h-4" />
                      </>
                    )}
                    {activeStep === 3 && (
                      <>
                        <div className="relative w-fit mt-[-1.00px] font-h3 font-[number:var(--h3-font-weight)] text-primaryblack text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                          Confirmar cadastro
                        </div>
                        <Check className="!relative !w-4 !h-4" />
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-[400px] min-h-[70px] bg-[#ffffff0d] rounded-2xl border border-solid border-greyscale-70 backdrop-blur-[5.85px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5.85px)_brightness(100%)]">
          <CardContent className="gap-2 px-8 py-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-white text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                Já tem conta?
              </div>
            </div>

            <Link href="/">
              <Button
                className="w-[336px] bg-greyscale-90 border border-solid border-greyscale-80 
              flex items-center justify-center gap-1 px-4 py-3 relative flex-[0_0_auto] rounded-sm 
              h-auto hover:bg-greyscale-90/90"
                onClick={() => window.location.reload()}
              >
                <div className="relative w-fit mt-[-1.00px] font-h3 font-[number:var(--h3-font-weight)] text-white text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                  Ir para Login
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {registerError && (
          <div className="flex items-end flex-col gap-4 w-full">
            <Alert
              variant="destructive"
              className="flex gap-2 p-4 w-[343px] bg-[#fef2f2] rounded-sm border border-solid border-[#dc2626]"
            >
              <X className="w-4 h-4 mt-0.5" />
              <AlertDescription className="font-p-1 font-[number:var(--p-1-font-weight)] text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
                {registerError}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {registerSuccess && (
          <div className="flex items-end flex-col gap-4 w-full">
            <Alert
              variant="default"
              className="flex gap-2 p-4 w-[343px] bg-[#f3fef2] rounded-sm border border-solid border-[#4adc26] text-[#277413]"
            >
              <CheckCircle className="w-4 h-4 mt-0.5 " />
              <AlertDescription className="text-[#277413] font-p-1 font-[number:var(--p-1-font-weight)] text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)]">
                {registerSuccess}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
