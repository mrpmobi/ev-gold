import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { apiService } from "@/lib/api";
import { authManager } from "@/lib/auth";
import { formatMoney, parseMoney } from "@/utils/formatters";
import { maskCPF } from "@/utils/masks";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LabelInput } from "./label-input";

interface SaqueDialogProps {
  cpf: string;
  saldo: string;
}

export function SaqueDialog({ cpf, saldo }: SaqueDialogProps) {
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [resultView, setResultView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valorSaque, setValorSaque] = useState(() => {
    return Math.round(parseFloat(saldo) * 100).toString();
  });

  useEffect(() => {
    setValorSaque(() => {
      return Math.round(parseFloat(saldo) * 100).toString();
    });
  }, [saldo]);
  
  const handleClick = async () => {
    setLoading(true);
    const token = authManager.getToken();
    if (!token) return;
    try {
      const result = await apiService.saque(token, valorSaque);

      if (result.success && result.data) {
        toast.success("Saque realizado com sucesso!");
        setResult("success");
      } else {
        toast.error(result.message || "Erro ao sacar.");
        setResult("error");
      }
    } catch (err) {
      toast.error("Erro de rede. Tente novamente mais tarde.");
      setResult("error");
    } finally {
      setLoading(false);
      setResultView(true);
    }
  };

  const handleClose = () => {
    setResult(null);
    setValorSaque(() => {
      return Math.round(parseFloat(saldo) * 100).toString();
    });
    setResultView(false);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    const valorDigitado = e.target.value.replace(/\D/g, "");

    // Limita o valor máximo ao saldo
    const valorNumerico = Math.min(
      parseInt(valorDigitado || "0", 10),
      Math.round(parseFloat(saldo.toString()) * 100)
    );

    // Atualiza o estado com o valor em centavos
    setValorSaque(valorNumerico.toString());
  };

  // Formata o valor para exibição
  const valorExibicao = formatMoney(parseFloat(valorSaque) / 100);

  return (
    <Dialog>
      <DialogTrigger className="gap-1 px-2 py-1 rounded-sm inline-flex items-center hover:bg-[#424242]">
        <span className="hidden md:block text-greyscale-30 text-xs px-0">
          Sacar
        </span>
        <img src="pix.svg" alt="Pix" className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[559px] h-[417px] flex flex-col justify-between p-10 bg-primaryblack border-0 rounded-xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between w-full">
          <DialogTitle className="font-h1 font-[number:var(--h1-font-weight)] text-greyscale-30 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] whitespace-nowrap [font-style:var(--h1-font-style)]">
            Saque de saldo
          </DialogTitle>
          <DialogClose
            onClick={handleClose}
            className="w-8 h-8 text-greyscale-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="w-12 h-12 border-4 border-t-primarymobi border-gray-200 rounded-full animate-spin"></div>
            <div className="font-p-1 font-[number:var(--p-1-font-weight)] text-greyscale-30 text-[length:var(--p-1-font-size)] text-center tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
              Processando saque...
            </div>
          </div>
        )}

        {!loading && !resultView && (
          <>
            <DialogDescription className="flex flex-col gap-4 w-full">
              <section className="flex flex-col gap-2 w-full">
                <Card className="min-h-[70px] w-full rounded-lg overflow-hidden border border-solid border-primarymobi bg-transparent">
                  <CardContent className="flex items-center justify-center gap-4">
                    <div className="flex flex-col gap-4 flex-1">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2 w-full">
                          <div className="font-h3 font-[number:var(--h3-font-weight)] text-greyscale-40 text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                            PIX CPF
                          </div>
                        </div>

                        <div className="font-h2 font-[number:var(--h2-font-weight)] text-primarywhite text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                          {maskCPF(cpf)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-2.5 w-full">
                  <Alert className="flex items-start gap-2 p-4 w-full bg-[#fcf3da] rounded-sm border border-solid border-supportyellow">
                    <AlertTriangle className="w-4 h-4 text-supportyellow flex-shrink-0 mt-0.5" />
                    <AlertDescription className="font-p-1 font-[number:var(--p-1-font-weight)] text-supportyellow text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
                      Não é possível editar o CPF ou a chave PIX. Se necessário,
                      entre em contato com o suporte
                    </AlertDescription>
                  </Alert>
                </div>
              </section>

              <section className="flex flex-col gap-1 w-full">
                <LabelInput
                  id="valorSaque"
                  name="valorSaque"
                  value={valorExibicao}
                  onChange={handleValorChange}
                  label="Valor do saque"
                />
              </section>
            </DialogDescription>
            <footer className="flex flex-col gap-2 w-full">
              <Button
                onClick={handleClick}
                disabled={loading}
                className="h-11 w-full bg-primarymobi rounded-sm hover:bg-primarymobi/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-h3 font-[number:var(--h3-font-weight)] text-primaryblack text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                  {loading ? "Processando..." : "Sacar"}
                </span>
              </Button>
            </footer>
          </>
        )}

        {!loading && resultView && result === "error" && (
          <>
            <div className="flex-col items-center justify-center gap-6 flex relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex-col items-center gap-4 flex relative self-stretch w-full flex-[0_0_auto]">
                <X className="!relative !w-12 !h-12 !aspect-[1] text-supportred" />
                <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative self-stretch mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-supportred text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                    Erro ao solicitar o saque
                  </div>

                  <div className="relative self-stretch font-p-1 font-[number:var(--p-1-font-weight)] text-greyscale-30 text-[length:var(--p-1-font-size)] text-center tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
                    Houve uma falha técnica na sua solicitação de saque, tente
                    novamente ou entre em contato com o suporte.
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

        {!loading && resultView && result === "success" && (
          <>
            <div className="flex-col items-center justify-center gap-6 flex relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex-col items-center gap-4 flex relative self-stretch w-full flex-[0_0_auto]">
                <CheckCircle className="!relative !w-12 !h-12 !aspect-[1] text-supportgreen" />
                <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative self-stretch mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-supportgreen text-[length:var(--h2-font-size)] text-center tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
                    Saque solicitado com sucesso
                  </div>

                  <div className="relative self-stretch font-p-1 font-[number:var(--p-1-font-weight)] text-greyscale-30 text-[length:var(--p-1-font-size)] text-center tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] [font-style:var(--p-1-font-style)]">
                    Se a chave estiver cadastrada no seu banco, o deposito será
                    concluído em até 2 horas.
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <Alert className="flex items-center justify-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#fcf3da] rounded-sm border border-solid border-supportyellow">
                  <AlertTriangle className="!relative !w-4 !h-4 text-supportyellow" />
                  <AlertDescription className="relative w-fit mt-[-0.50px] font-p-1 font-[number:var(--p-1-font-weight)] text-supportyellow text-[length:var(--p-1-font-size)] tracking-[var(--p-1-letter-spacing)] leading-[var(--p-1-line-height)] whitespace-nowrap [font-style:var(--p-1-font-style)]">
                    Se sua chave não estiver cadastrada como PIX, o saldo
                    retornará.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
              <Button
                onClick={handleClose}
                className="flex h-11 items-center justify-center gap-1 px-4 py-3 relative self-stretch w-full bg-greyscale-90 rounded-sm border border-solid border-greyscale-80 hover:bg-greyscale-80"
              >
                <div className="relative w-fit font-h3 font-[number:var(--h3-font-weight)] text-primarywhite text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                  Fechar
                </div>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
