// components/badges-modal.tsx
"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface Badge {
  emoji: string;
  name: string;
  description: string;
}

interface BadgesModalProps {
  trigger?: React.ReactNode;
}

const userBadges: Badge[] = [
  {
    emoji: "🏅",
    name: "Licenciado Gold",
    description: "Parceiro oficial com acesso a recursos e suporte exclusivos da plataforma Gold."
  },
  {
    emoji: "🏆",
    name: "Licenciado Premium Gold",
    description: "Nível máximo de parceria com benefícios e vantagens exclusivas."
  },
  {
    emoji: "💎",
    name: "Revenda MRP Med",
    description: "Direito de revenda dos produtos MRP Med com 50% de margem de lucro."
  }
];

export function BadgesModal({ trigger }: BadgesModalProps) {
  const defaultTrigger = (
    <Button
      size="icon"
      className="bg-primaryblack hover:bg-primarymobi text-greyscale-70 hover:text-primaryblack"
    >
      <Award className="w-6 h-6" />
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[559px] h-[450px] flex flex-col justify-between p-10 bg-primaryblack border-0 rounded-xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between w-full">
          <DialogTitle className="font-h1 font-[number:var(--h1-font-weight)] text-greyscale-30 text-[length:var(--h1-font-size)] tracking-[var(--h1-letter-spacing)] leading-[var(--h1-line-height)] whitespace-nowrap [font-style:var(--h1-font-style)]">
            Meus Selos
          </DialogTitle>
          <DialogClose
            className="w-8 h-8 text-greyscale-30 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {userBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-greyscale-800 border border-greyscale-700"
            >
              <span className="text-2xl">{badge.emoji}</span>
              <div>
                <h4 className="font-semibold text-greyscale-50">{badge.name}</h4>
                <p className="text-sm text-greyscale-30 mt-1">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}