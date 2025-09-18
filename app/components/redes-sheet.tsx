import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { StringToggleGroup } from "./string-togglegroup";
import { useState } from "react";

interface RedesSheetProps {
  levelFilter: string;
  onLevelChange: (value: string | undefined) => void;
  levelOptions: { label: string; value: string }[];
  timeFilter: string;
  onTimeChange: (value: string | undefined) => void;
  timeOptions: { label: string; value: string }[];
}

export function RedesSheet({ levelFilter, onLevelChange, levelOptions, timeFilter, onTimeChange, timeOptions }: RedesSheetProps) {
  const [open, setOpen] = useState(false);

  const handleClear = () => {
    onLevelChange("todos");
    onTimeChange("sempre");
    setOpen(false);
  };

  const handleApply = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex px-4 py-3 flex-1 bg-greyscale-90 rounded-xs border border-solid border-greyscale-80 items-center justify-center gap-1 relative h-auto text-white hover:bg-greyscale-80">
          <div className="relative font-h3 font-[number:var(--h3-font-weight)] text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
            Filtrar
          </div>
          <Filter className="!relative !w-4 !h-4" />
        </Button>
      </SheetTrigger>
      <SheetTitle className="hidden">Filtros</SheetTitle>
      <SheetContent side="bottom" className="h-auto rounded-t-lg">
        <div className="flex flex-col w-full items-start justify-end gap-10 pt-4 pb-6 px-4 relative bg-primaryblack rounded-[12px_12px_0px_0px] overflow-hidden">
          <div className="flex items-center gap-2.5 self-stretch w-full flex-col relative flex-[0_0_auto]">
            <div className="relative w-[30px] h-1 mt-[-2.00px] mb-[-1.00px] bg-greyscale-50 rounded-full" />
          </div>

          <div className="flex items-start gap-4 self-stretch w-full flex-col relative flex-[0_0_auto]">
            <div className="inline-flex items-start gap-2 flex-col relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-50 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                Filtrar por nível
              </div>
              <StringToggleGroup filter={levelFilter} onChange={onLevelChange} options={levelOptions}/>
            </div>

            <div className="inline-flex items-start gap-2 mr-[-4.00px] flex-col relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-h2 font-[number:var(--h2-font-weight)] text-greyscale-50 text-[length:var(--h2-font-size)] tracking-[var(--h2-letter-spacing)] leading-[var(--h2-line-height)] whitespace-nowrap [font-style:var(--h2-font-style)]">
                Filtrar por período
              </div>
              <StringToggleGroup filter={timeFilter} onChange={onTimeChange} options={timeOptions} />
            </div>
          </div>
          <div className="flex items-start gap-2 self-stretch w-full flex-col relative flex-[0_0_auto] bg-primaryblack">
            <Button
              onClick={handleApply}
              className="gap-1 px-4 py-3 bg-primarymobi flex h-11 items-center justify-center relative self-stretch w-full rounded-sm hover:bg-primarymobi/90"
            >
              <div className="relative w-fit font-h3 font-[number:var(--h3-font-weight)] text-primaryblack text-[length:var(--h3-font-size)] tracking-[var(--h3-letter-spacing)] leading-[var(--h3-line-height)] whitespace-nowrap [font-style:var(--h3-font-style)]">
                Aplicar
              </div>
            </Button>

            <Button
              variant="ghost"
              onClick={handleClear}
              className="gap-2 flex h-11 items-center justify-center relative self-stretch w-full rounded-sm hover:bg-transparent"
            >
              <div className="relative w-fit font-h4 font-[number:var(--h4-font-weight)] text-greyscale-30 text-[length:var(--h4-font-size)] text-center tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] whitespace-nowrap [font-style:var(--h4-font-style)]">
                Limpar
              </div>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
