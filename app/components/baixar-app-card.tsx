import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";

export function BaixarAppCard() {
  return (
    <Card className="flex flex-col min-h-[70px] items-start gap-6 p-6 bg-primaryblack rounded-lg border-0 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-4 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-2 relative flex-1 grow w-full md:w-auto">
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-30 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
              Apple Store / iOS
            </div>

            <div className="inline-flex items-center gap-2.5 px-1.5 py-0.5 relative flex-[0_0_auto]">
              <img className="w-3.5 h-[17px] object-cover" alt="Image" src="/apple-logo.svg" />
            </div>
          </div>

          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <Button className="w-full h-11 whitespace-nowrap flex items-center gap-2 bg-greyscale-90 text-white hover:bg-greyscale-80 border-greyscale-80 border-[1px] rounded-xs text-[12px]">
              Baixar App para iPhone
              <Download />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 relative flex-1 grow w-full md:w-auto">
          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-30 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
              Play Store / Android
            </div>
            <div className="inline-flex items-center gap-2.5 px-1.5 py-0.5 relative flex-[0_0_auto]">
              <img className="relative w-3.5 h-[17px] aspect-[0.81]" alt="Image" src="/android-logo.svg" />
            </div>
          </div>

          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] ">
            <Button className="w-full h-11 whitespace-nowrap flex items-center gap-2 bg-greyscale-90 text-white hover:bg-greyscale-80 border-greyscale-80 border-[1px] rounded-xs text-[12px]">
              Baixar App para Android
              <Download />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}