"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { PerfumeImage } from "@/lib/types/inteface";

type PropsCarousel = {
  images: PerfumeImage[];
};

export default function ThumbnailCarousel({ images }: PropsCarousel) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainRef, mainEmbla] = useEmblaCarousel({ loop: false });
  const [thumbRef, thumbEmbla] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const scrollTo = useCallback(
    (index: number) => {
      if (!mainEmbla) return;
      mainEmbla.scrollTo(index);
    },
    [mainEmbla]
  );

  const onSelect = useCallback(() => {
    if (!mainEmbla || !thumbEmbla) return;
    setSelectedIndex(mainEmbla.selectedScrollSnap());
    thumbEmbla.scrollTo(mainEmbla.selectedScrollSnap());
  }, [mainEmbla, thumbEmbla]);

  useEffect(() => {
    if (!mainEmbla) return;
    mainEmbla.on("select", onSelect);
    onSelect();
  }, [mainEmbla, onSelect]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Carousel */}
      <div className="overflow-hidden" ref={mainRef}>
        <div className="flex">
          {images.map((images) => (
            <div
              className="min-w-full relative aspect-square"
              key={images.displayOrder}
            >
              <Image
                src={images.imageUrl}
                alt={`Images ${images.displayOrder + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="overflow-hidden" ref={thumbRef}>
        <div className="flex flex-wrap gap-2">
          {images.map((images) => (
            <button
              onClick={() => scrollTo(images.displayOrder)}
              key={images.displayOrder}
              className={`relative w-24 h-16 shrink-0 overflow-hidden border-2 transition-all ${
                images.displayOrder === selectedIndex
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <Image
                src={images.imageUrl}
                alt={`Thumb ${images.displayOrder + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
