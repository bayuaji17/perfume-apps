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
import { usePathname } from "next/navigation";

export default function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

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
            <li className={"inline-block cursor-pointer group"}>
              <Link
                className="relative inline-block z-10"
                href={"/collections"}
              >
                Collections
                <span
                  className={`
        absolute left-0 bottom-0 h-0.5 w-full origin-left bg-black 
        transition-transform duration-300
        ${
          pathname === "/collections"
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100"
        }
      `}
                ></span>
              </Link>
            </li>
            <li className={"inline-block cursor-pointer group"}>
              <Link className="relative inline-block z-10" href={"/about"}>
                About
                <span
                  className={`
        absolute left-0 bottom-0 h-0.5 w-full origin-left bg-black 
        transition-transform duration-300
        ${
          pathname === "/about"
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100"
        }
      `}
                ></span>
              </Link>
            </li>
            <li>
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
            <SheetContent
              side="bottom"
              className="w-full h-full p-0 border-none"
            >
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
                <SheetClose asChild>
                  <Link href={"/"}>
                    <SheetTitle className="text-4xl text-center uppercase">
                      Zalisma
                    </SheetTitle>
                  </Link>
                </SheetClose>
                <VisuallyHidden asChild>
                  <SheetDescription />
                </VisuallyHidden>
              </SheetHeader>
              <ul className="mt-5 space-y-8 p-4">
                <li className="border-b-2 border-black text-2xl uppercase font-semibold">
                  <SheetClose asChild>
                    <Link href="/collections">Collections</Link>
                  </SheetClose>
                </li>
                <li className="border-b-2 border-black text-2xl uppercase font-semibold">
                  <SheetClose asChild>
                    <Link href="/about">About</Link>
                  </SheetClose>
                </li>
                <li className="border-b-2 border-black text-2xl uppercase font-semibold">
                  <SheetClose asChild>
                    <Link href="/collections">Shop Now</Link>
                  </SheetClose>
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
