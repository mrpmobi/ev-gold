"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const bannerImages = [
  "/banner-solar2.png",
  "/banner-med.png",
];

export function Banner() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="relative my-6 w-full max-w-[1014px] mx-auto">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="w-full rounded-lg overflow-hidden"
      >
        <CarouselContent>
          {bannerImages.map((imageUrl, index) => (
            <CarouselItem key={index}>
              <Card
                className="border-0 p-0 m-0 aspect-[4.9/1] md:aspect-[5/1] lg:aspect-[4.9/1] rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {bannerImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </Carousel>

      {bannerImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
          {bannerImages.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`h-2 w-2 rounded-full p-0 ${
                current === index ? "bg-primary" : "bg-muted"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
