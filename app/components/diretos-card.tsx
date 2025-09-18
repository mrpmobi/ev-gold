import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface DiretosCardProps {
  diretos: number;
  meta?: number;
  onEnterVIP?: () => void;
}

export function DiretosCard({
  diretos,
  meta = 10,
  onEnterVIP,
}: DiretosCardProps) {
  const unlocked = diretos >= meta;

  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/557399504398?text=Quero%20saber%20como%20posso%20fazer%20parte%20do%20Grupo%20Vip%3F",
      "_blank"
    );
  };

  return (
    <Card className="flex flex-col items-start p-6 gap-4 bg-[#121212] rounded-lg border-0 h-auto relative overflow-hidden">
      <CardHeader className="p-0 w-full">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="whitespace-nowrap font-medium text-[#6C6C6C]">
            Total de diretos
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-3 w-full">
        <div className="text-3xl font-medium text-white">{diretos}</div>
        {unlocked && (
          <div className="relative flex flex-col items-center justify-center gap-2 mt-3">
            <img
              src="/crown.svg"
              alt="VIP"
              width={40}
              height={40}
              className="absolute top-[-60px] left-1/2 transform -translate-x-1/2"
            />
            <p className="text-lg text-white flex items-center gap-2 text-center">
              Parabéns! Você foi selecionado para participar de uma triagem
              exclusiva do nosso grupo VIP{" "}
              <span className="flex items-center gap-1">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-md"></span>
              </span>
            </p>
          </div>
        )}

        <ProgressButton
          progress={unlocked ? 100 : Math.min((diretos / meta) * 100, 100)}
          unlocked={unlocked}
          label={
            unlocked
              ? "Entre em contato com o suporte"
              : `Faltam ${Math.max(meta - diretos, 0)} diretos`
          }
          onClick={handleWhatsAppClick}
        />
      </CardContent>
    </Card>
  );
}

function ProgressButton({
  progress,
  unlocked,
  label,
  onClick,
}: {
  progress: number;
  unlocked: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!unlocked}
      className={`relative w-full h-12 rounded-xl font-semibold flex items-center justify-center overflow-hidden transition-all duration-300
        ${
          unlocked
            ? "cursor-pointer hover:brightness-110"
            : "cursor-not-allowed opacity-80"
        }
      `}
      style={{
        background: unlocked
          ? "linear-gradient(180deg,#fff7e1 0%, #ffd84d 10%, #f7c348 40%, #d4a200 60%, #b88600 100%)"
          : "#2d2d2f",
        boxShadow: unlocked
          ? "0 6px 18px rgba(217,150,0,0.18), inset 0 -4px 8px rgba(0,0,0,0.25)"
          : "inset 0 -2px 4px rgba(0,0,0,0.4)",
      }}
    >
      <span
        className="absolute top-0 left-0 h-full transition-all duration-700"
        style={{
          width: `${progress}%`,
          background: unlocked
            ? "linear-gradient(90deg,#FFD84D,#F7C348,#D4A200)"
            : "linear-gradient(90deg,#4B5563,#9CA3AF,#FFD84D)",
          opacity: unlocked ? 1 : 0.5,
        }}
      />

      <span className="relative z-10 text-sm font-bold text-black">
        {label}
      </span>

      {unlocked && (
        <span className="absolute z-20 top-0 left-0 w-full h-full pointer-events-none glare" />
      )}

      <style jsx>{`
        .glare {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-20deg);
          animation: glareMove 2.5s infinite;
        }
        @keyframes glareMove {
          0% {
            transform: translateX(-120%) skewX(-20deg);
          }
          100% {
            transform: translateX(220%) skewX(-20deg);
          }
        }
      `}</style>
    </button>
  );
}
