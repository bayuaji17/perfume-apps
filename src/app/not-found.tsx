import Container from "@/components/public-component/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-[6rem] md:text-[8rem] font-extrabold tracking-tight">
          404
        </h1>
        <p className="text-xl md:text-2xl font-light mt-2">Page Not Found</p>
        <p className="text-sm md:text-base text-gray-500 mt-2 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex mt-6 gap-2">
          <Button asChild variant={"outline"}>
            <Link
              href={"/"}
              className="relative rounded-none mt-3 border-black overflow-hidden group text-black border-2 cursor-pointer text-center"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Go Home
              </span>
              <span className="absolute inset-0 bg-black scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link
              href={"/collections"}
              className="relative rounded-none mt-3 border-black overflow-hidden group text-black border-2 cursor-pointer text-center"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Explore Perfumes
              </span>
              <span className="absolute inset-0 bg-black scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </Button>
        </div>

        <blockquote className="italic text-gray-400 mt-10 max-w-lg text-sm">
          &quot;Simplicity is the keynote of all true elegance.&quot; — Coco
          Chanel
        </blockquote>
    </Container>
  );
}
