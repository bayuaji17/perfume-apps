"use client";
import Image from "next/image";
import React from "react";
import Container from "./container";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ScentSection() {
  return (
    <section className="py-2">
      <Container className="flex flex-col-reverse md:flex-row gap-4 mt-4 md:items-center">
        <div className="flex flex-col w-full space-y-4 md:w-1/2 max-h-full justify-center xl:space-y-4">
          <h1 className="text-center md:text-left lg:text-left text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold">
            Discover the Soul of Every Scent
          </h1>
          <p className="text-base sm:text-sm lg:text-lg text-justify">
            Every perfume begins with a story — told through its notes. From
            fresh florals to deep woods, explore the ingredients that define
            each fragrance. Discover what makes a scent truly unforgettable.
          </p>
          <Button
            variant={"outline"}
            className="rounded-none border-black hover:text-white hover:bg-black md:w-1/2 text-lg"
            asChild
          >
            <Link href={"/collections"}>Explore Scents</Link>
          </Button>
        </div>
        <div className="flex w-full md:w-1/2 justify-center">
          <div className="relative aspect-square w-xl md:w-80 md:h-80 lg:w-xl lg:h-full">
            <Image
              src={
                "https://images.unsplash.com/photo-1621447578061-c44ef2aed7de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHxzY2VudHxlbnwwfHwwfHx8MA%3D%3D"
              }
              alt="scent"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
