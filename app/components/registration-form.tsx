import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { authManager } from "@/lib/auth";
import { apiService } from "@/lib/api";

interface RegistrationFormProps {
  onComplete?: () => void;
}

const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const [accepted, setAccepted] = useState(false);
  const [currentDateTime] = useState(new Date().toLocaleString('pt-BR'));
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setIpAddress('Não disponível');
      }
    };

    getIpAddress();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accepted) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }

    try {
      const token = authManager.getToken();
      if (!token) return;
      setLoading(true);
      const [res] = await Promise.all([apiService.aceitarTermos(token)]);

      if (res.success && res.data) {
        toast.success("Termos aceitos com sucesso!");
        if (onComplete) onComplete();
      }

    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const documents = [
    {
      icon: FileText,
      title: "Contrato de Prestação de Serviços Digitais",
      url: "https://ev.mrpgold.com.br/contrato-licenca"
    },
    {
      icon: Shield,
      title: "Termos de Uso da Plataforma",
      url: "https://ev.mrpgold.com.br/termos-de-uso"
    },
    {
      icon: Lock,
      title: "Política de Privacidade e Proteção de Dados Pessoais",
      url: "https://ev.mrpgold.com.br/politica-de-privacidade"
    }
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-greyscale-90 border-greyscale-70 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-4 border-b border-greyscale-70">
          <div className="flex items-center justify-center gap-3">
            <img src="/gold-logo.svg" alt="Logo" className="w-[200px] h-auto" />
          </div>
          <div>
            <CardTitle className="text-xl text-white">
              Aceitar Termos
            </CardTitle>
            <CardDescription className="text-greyscale-40 mt-2">
              Complete seu cadastro aceitando os termos e condições
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Documents Section */}
          <div className="space-y-4">
            <p className="text-sm text-greyscale-30 leading-relaxed">
              Ao prosseguir com o cadastro, declaro que li, compreendi e aceito integralmente os seguintes documentos que regem o uso da plataforma MRP GOLD LTDA:
            </p>

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-lg border border-greyscale-70 bg-greyscale-80 hover:bg-greyscale-70 hover:border-yellow-500 transition-all duration-200 group"
                >
                  <doc.icon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
                    {doc.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Authorization Text */}
          <div className="p-4 rounded-lg bg-greyscale-80 border border-greyscale-70">
            <p className="text-sm text-greyscale-30 leading-relaxed">
              Autorizo o tratamento dos meus dados pessoais pela MRP GOLD LTDA, conforme descrito na Política de Privacidade, e reconheço que o não cumprimento das regras previstas poderá resultar em suspensão ou encerramento da conta, conforme os Termos de Uso.
            </p>
          </div>

          {/* Acceptance Checkbox */}
          <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/10">
            <Checkbox
              id="accept"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-0.5 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
            />
            <label
              htmlFor="accept"
              className="text-sm font-medium text-white leading-relaxed cursor-pointer select-none flex-1"
            >
              Concordo com o Contrato de Prestação de Serviços, os Termos de Uso e a Política de Privacidade.
            </label>
          </div>

          {/* Tracking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-greyscale-80 border border-greyscale-70">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-yellow-500" />
              <div className="text-sm">
                <span className="font-medium text-greyscale-30">Data e hora:</span>
                <p className="text-xs text-greyscale-40 mt-1">{currentDateTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-yellow-500" />
              <div className="text-sm">
                <span className="font-medium text-greyscale-30">Endereço IP:</span>
                <p className="text-xs text-greyscale-40 mt-1">{ipAddress}</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!accepted || loading}
            className="w-full h-12 text-base font-semibold bg-yellow-500 hover:bg-yellow-600 text-greyscale-900 disabled:bg-greyscale-600 disabled:text-greyscale-400 transition-colors"
            size="lg"
          >
            {loading ? "Aceitando..." : "Aceitar Termos"}
          </Button>

          <p className="text-xs text-center text-greyscale-40">
            Ao criar sua conta, você confirma que leu e aceitou todos os termos e condições.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;