import { Card } from "@/components/ui/card";
import React from "react";

export function Banner() {
  return (
    <Card
      className="
      relative
      my-6
      w-full max-w-[1014px]
      rounded-lg
      overflow-hidden
      border-0
      p-0
      aspect-[4.9/1] md:aspect-[5/1] lg:aspect-[4.9/1]
      "
      style={{
        backgroundImage: "url('/banner-solare.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Conteúdo adicional pode ir aqui */}
    </Card>
  );
}