import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import Container from "./container";

export default function HeroSection() {
  return (
    <section className="bg-gray-200 font-sans pb-2 sm:pb-20 md:pb-4">
      <Container className="flex flex-col md:flex-row gap-2 justify-center items-center w-full sm:h-screen">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-[3/4] overflow-hidden h-[30rem] md:h-96  lg:h-[40rem] mx-auto">
            <Image
              src={
                "https://images.unsplash.com/photo-1648208567967-19e0b7b10066?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEzfHxwZXJmdW1lJTIwYm90dGxlfGVufDB8fDB8fHww"
              }
              alt="Perfume"
              loading="lazy"
              fill
              className="object-cover object-right"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4 mt-4 text-center">
          <h1 className="text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center md:text-left">Begin Your Scented Journey</h1>
          <p className="font-light text-lg">
            Discover refined scents crafted to capture your essence and leave a
            lasting impression.
          </p>
          <div className="flex flex-col h-full gap-2 items-center justify-center sm:justify-normal ">
            <Button className="rounded-none w-full" size={"lg"}>
              <Link href={"/collections"} className="text-lg">Explore Collection</Link>
            </Button>
            <Button
              variant={"ghost"}
              className="rounded-none w-full border-black border-2 hover:bg-black hover:text-white"
              size={"lg"}
            >
              <Link href={"/collections"} className="text-lg">Our Story</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
