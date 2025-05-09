"use client";

import { usePerfumesById } from "@/hooks/use-perfumes";
import Container from "./container";
import { Separator } from "../ui/separator";
import { formatCurrency, mapConcentration, mapNotes } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import Link from "next/link";
import ThumbnailCarousel from "./thumbnail-carousel";

export default function DetailPerfume({ id }: { id: string }) {
  const { data, isLoading } = usePerfumesById(id);

  const perfumeImages = data?.images || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="mr-2 text-xl font-bold">Loading...</span>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
        </div>
      </div>
    );
  }

  return (
    <section>
      <Container className="grid lg:grid-cols-2 gap-2">
        {/* Perfume Images */}
        <div className="">
          <ThumbnailCarousel images={perfumeImages} />
        </div>
        {/* Detail perfumes */}
        <div className="flex flex-col ">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-5xl font-black">{data?.name}</h1>
            <h3 className="text-3xl font-semibold">By {data?.brand.name}</h3>
            <p className="text-xl font-semibold">
              {formatCurrency(data?.price as string)}
            </p>
          </div>
          <Separator className="my-2 bg-black !h-0.5" />
          <h1 className="font-bold text-xl">Story Behind</h1>
          <p className="text-justify my-2 tracking-wide leading-7 text-base">
            {data?.description}
          </p>
          <Separator className="my-2 bg-black !h-0.5" />
          {data?.checkoutLinks.map((c) => (
            <Button asChild key={c.id} className="rounded-none my-1 text-xl">
              <Link href={c.link} className="uppercase">
                Buy on {c.platform}
              </Link>
            </Button>
          ))}
          <Separator className="my-2 bg-black !h-0.5" />
          <h1 className="font-bold text-xl">Notes Description</h1>
          <Accordion type="multiple">
            {data?.notes.map((notes) => (
              <AccordionItem value={notes.id} key={notes.id}>
                <AccordionTrigger className="text-lg">
                  {mapNotes(notes.role)}
                </AccordionTrigger>
                <AccordionContent className="text-base tracking-tight">
                  {notes.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Separator className="my-2 bg-black !h-0.5" />
          <h1 className="font-bold text-xl">Details</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mt-2">
            <div className="grid grid-cols-[max-content_max-content_auto] gap-2">
              <span className="text-lg">Size</span>
              <span className="text-center text-lg">:</span>
              <p className="text-left after:content-['ML'] after:pl-1 text-lg">
                {data?.sizeML}
              </p>

              <span className="text-lg ">Concentration</span>
              <span className="text-center text-lg">:</span>
              <p className="text-left text-lg">
                {mapConcentration(data?.concentration as string)}
              </p>
              <span className="text-lg block sm:hidden">Gender</span>
              <span className="text-center text-lg block sm:hidden">:</span>
              <p className="text-left capitalize text-lg block sm:hidden">
                {data?.gender}
              </p>
            </div>
            <div className="hidden sm:grid grid-cols-[max-content_max-content_auto] gap-2">
              <span className="text-lg">Gender</span>
              <span className="text-center text-lg">:</span>
              <p className="text-left capitalize text-lg">{data?.gender}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
