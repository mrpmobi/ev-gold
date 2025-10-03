import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Share } from "lucide-react";
import { useState } from "react";

interface LinkCardProps {
  linkConvite: string;
}

export function LinkCard({ linkConvite }: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkConvite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      //console.error("Erro ao copiar link:", err);
    }
  };

  async function handleShareButton() {
    const shareData = {
      title: 'MRP Mobi',
      text: 'Venha ganhar também!',
      url: linkConvite, // você pode colocar qualquer link
    };

    try {
      if (navigator.share) {
        // Tenta abrir o menu nativo de compartilhamento
        await navigator.share(shareData);
      } else {
        // Fallback: navegador não suporta Web Share API
        alert('Compartilhamento não suportado neste navegador. Copie o link manualmente!');
      }
    } catch (err) {
      //console.error('Erro ao compartilhar:', err);
    }
  }
  /*  MÉTODO PARA RETORNAR TIPO DE ERRO, bilbioteca exige protocolo HTTPS e Certificado SSL
  async function handleShareButton() {
    const shareData = {
      title: "MRP Mobi",
      text: "Venha ganhar também!",
      url: linkConvite,
    };

    try {
      if (!navigator.share) {
        if (window.location.protocol !== "https:") {
          alert("O compartilhamento requer HTTPS. Verifique seu certificado SSL.");
        } else {
          alert("Este navegador não suporta compartilhamento nativo.");
        }
        return;
      }

      await navigator.share(shareData);
      //console.log("Conteúdo compartilhado com sucesso!");
    } catch (err: any) {
      if (window.location.protocol !== "https:") {
        //console.error("Erro: a página não está em HTTPS. Atualize o certificado SSL.");
      } else {
        //console.error("Erro inesperado ao compartilhar:", err);
      }
    }
  }*/  
  return (
    <Card className="bg-primaryblack rounded-lg border-0 p-6 h-[149px]">
      <CardHeader className="p-0 w-full">
        <CardTitle className="text-greyscale-70 font-medium">Seu link de patrocínio</CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col w-full">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 flex items-center bg-white rounded-xs border border-greyscale-50 overflow-hidden h-11">
            <div className="flex-1 min-w-0 px-4 py-3">
              <div className="text-primaryblack text-sm truncate">{linkConvite}</div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 flex-shrink-0 text-greyscale-50 hover:bg-greyscale-30 hover:text-white"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                </>
              )}
            </Button>
          </div>

          <Button onClick={handleShareButton} className="h-11 whitespace-nowrap flex items-center gap-2 bg-primary text-primaryblack rounded-xs">
            Compartilhar
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
