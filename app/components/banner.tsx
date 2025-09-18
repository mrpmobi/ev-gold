import { Card } from "@/components/ui/card";
import React from "react";

export function Banner() {
  return (
    <Card
      className="
        relative flex flex-row justify-between items-center
        my-6
        w-full h-[16vw] min-h-[70px]
        rounded-lg
        overflow-hidden
        bg-primarymobi border-0
      "
    >
      <img src="/banner-background.jpg" className="absolute top-[-3vw] left-0 w-[44vw]" />

      <div className="flex flex-row items-center w-full h-full p-[3.69vw] z-10">
        <img className="h-[4.24vw]" alt="Mrp mobi completo" src="/mobi.svg" />
      </div>

      <div className="absolute right-[3.47vw] top-1/2 -translate-y-1/2 w-[25.07vw] text-white text-[2.78vw] font-semibold z-20">Mobilidade que lhe enriquece.</div>

      <img src="/banner-foreground.svg" className="absolute bottom-0 right-0 h-full w-full" />
    </Card>
  );
}