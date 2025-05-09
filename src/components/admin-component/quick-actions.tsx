import Link from "next/link";
import AddBrand from "./brands/add-brand";
import { Card, CardContent } from "../ui/card";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AddBrand
        openDialog={
          <Card className="relative mt-3 border-black overflow-hidden group text-black border-2 cursor-pointer text-center">
            <span className="absolute inset-0 bg-black scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />

            <CardContent className="relative z-10">
              <p className="inline-block mb-2">
                <span className="relative inline-block font-medium text-base text-wrap text-black group-hover:text-white transition-colors duration-300 uppercase">
                  Create new Brand
                  <span className="absolute left-0 bottom-0 h-0.5 w-full origin-center scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </p>
            </CardContent>
          </Card>
        }
      />
      <Link href={"dashboard/perfumes/add-perfume"} className="text-center">
        <Card className="relative mt-3 border-black overflow-hidden group text-black border-2 cursor-pointer">
          <span className="absolute inset-0 bg-black scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />

          <CardContent className="relative z-10">
            <p className="inline-block mb-2">
              <span className="relative inline-block font-medium text-base text-wrap text-black group-hover:text-white transition-colors duration-300 uppercase">
                Create new perfumes
                <span className="absolute left-0 bottom-0 h-0.5 w-full origin-center scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </p>
          </CardContent>
        </Card>
      </Link>
      {/* View Collections */}
      <Link href={"collections"} className="text-center">
        <Card className="relative mt-3 border-black overflow-hidden group text-black border-2 cursor-pointer">
          <span className="absolute inset-0 bg-black scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />

          <CardContent className="relative z-10">
            <p className="inline-block mb-2">
              <span className="relative inline-block font-medium text-base text-wrap text-black group-hover:text-white transition-colors duration-300 uppercase">
                View Collections
                <span className="absolute left-0 bottom-0 h-0.5 w-full origin-center scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </p>
          </CardContent>
        </Card>
      </Link>
      {/* Manage CO Links */}
      <Link href={"dashboard/checkout-links"} className="text-center">
        <Card className="relative mt-3 border-black overflow-hidden group text-black border-2 cursor-pointer">
          <span className="absolute inset-0 bg-black scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />

          <CardContent className="relative z-10">
            <p className="inline-block mb-2">
              <span className="relative inline-block font-medium text-base text-wrap text-black group-hover:text-white transition-colors duration-300 uppercase">
                Manage Checkout Links
                <span className="absolute left-0 bottom-0 h-0.5 w-full origin-center scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </p>
          </CardContent>
        </Card>
      </Link>
      {/* <Button asChild className="text-2xl">
        <Link href={"dashboard/perfumes/add-perfume"}>View Collections</Link>
      </Button>
      <Button asChild className="text-2xl">
        <Link href={"dashboard/perfumes/add-perfume"}>Add Perfumes</Link>
      </Button>
      <Button asChild className="text-2xl">
        <Link href={"dashboard/perfumes/add-perfume"}>Add Brand</Link>
      </Button>
      <Button asChild className="text-2xl">
        <Link href={"dashboard/perfumes/add-perfume"}>
          Manage Checkout Links
        </Link>
      </Button> */}
    </div>
  );
}
