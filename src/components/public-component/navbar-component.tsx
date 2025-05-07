"use client";

import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Container from "./container";
import Link from "next/link";

export default function Navbar() {
  const isMobile = useIsMobile();

  return (
    <nav className="font-sans border-b-2 border-black z-50 sticky top-0 bg-white/70 backdrop-blur-lg">
      <Container className="flex items-center justify-between">
        <div>
          <Link href={"/"} className="text-2xl font-bold uppercase">
            Zalisma
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <ul className="flex items-center justify-between space-x-4 uppercase font-semibold text-lg">
            <li className="hover:underline">
              <Link href={"/collections"}>Collections</Link>
            </li>
            <li className="hover:underline">
              <Link href={"/about"}>About</Link>
            </li>
            <li className="hover:underline">
              <Button
                className="rounded-none uppercase border-black hover:bg-black hover:text-white bg-transparent font-bold"
                variant={"outline"}
              >
                <Link href={"/collections"}>Shop Now</Link>
              </Button>
            </li>
          </ul>
        </div>

        {/* Mobile Sidebar */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                asChild
                variant={"ghost"}
                size={"icon"}
                className="md:hidden"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full h-full p-0 border-none">
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-50 bg-white"
                >
                  <X className="size-6" />
                </Button>
              </SheetClose>
              <SheetHeader>
                <SheetTitle className="text-4xl text-center uppercase">
                  Zalisma
                </SheetTitle>
                <VisuallyHidden asChild>
                  <SheetDescription />
                </VisuallyHidden>
              </SheetHeader>
              <ul className="mt-5 space-y-8 p-4">
                <li className="border-b-2 border-black text-2xl uppercase font-semibold">
                  <a href="/products">Collections</a>
                </li>
                <li className="border-b-2 border-black text-2xl uppercase font-semibold">
                  <a href="/contact">About</a>
                </li>
                <li className="border-b-2 border-black text-2xl uppercase font-semibold">
                  <a href="/contact">Shop Now</a>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        ) : (
          <Button variant={"ghost"} size={"xl"} className="md:hidden">
            <Menu className="size-6" />
          </Button>
        )}
      </Container>
    </nav>
  );
}
