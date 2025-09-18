import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";

interface ProgressCardProps {
  completedPercentage: number;
}

export function ProgressCard({ completedPercentage }: ProgressCardProps) {
  return (
    <Card className="border border-solid border-primarymobi bg-transparent">
      <CardContent className="flex items-center justify-center gap-4 min-h-[70px]">
        <div className="flex flex-col items-start gap-4 relative flex-1 grow">
          <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-h3 font-[number:var(--h3-font-weight)] text-greyscale-40 text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                Complete seu perfil
              </div>
            </div>

            <div className="relative self-stretch font-h2 font-[number:var(--h2-font-weight)] text-white text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] [font-style:var(--h2-font-style)]">
              {completedPercentage}% completo
            </div>
          </div>

          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] mb-[-1.00px]">
            <Progress value={completedPercentage} className="w-full h-0.5" />
          </div>
        </div>

        <ChevronRight className="w-4 h-4" />
      </CardContent>
    </Card>
  );
}
