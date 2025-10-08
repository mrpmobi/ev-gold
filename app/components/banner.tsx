import { Card } from "@/components/ui/card";
import React from "react";

export function Banner() {
  return (
    <Card
      className="
        relative flex justify-center items-center
        my-6
        w-[1014px] h-[207px] min-h-[70px]
        rounded-lg
        overflow-hidden
        bg-primary border-0
      "
    >
      <img src="/banner-solare.png" className="w-full h-auto my-0" />
    </Card>
  );
}