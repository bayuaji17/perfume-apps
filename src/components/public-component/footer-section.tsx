"use client";

import Link from "next/link";
import Container from "./container";

export default function FooterSection() {
  return (
    <footer className="bg-black text-white font-sans py-2">
      <Container className="flex flex-col">
        <div className="flex flex-col space-y-4 lg:flex-row justify-between my-6">
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-2xl font-bold uppercase">Zalisma Perfumes</h3>
            <p className="w-52 text-base text-center sm:text-left">
              Crafted with passion, worn with confidence.
            </p>
          </div>
          <div className="flex justify-between lg:space-x-24">
            <div className="flex flex-col items-start">
              <h5 className="text-lg sm:text-xl font-semibold">Marketplace</h5>
              <ul className="space-y-2 mt-2">
                <li className="text-base sm:text-lg hover:underline">
                  <Link href={"https://www.shopee.co.id/"}>Shopee</Link>
                </li>
                <li className="text-base sm:text-lg hover:underline">
                  <Link href={"https://www.tokopedia.com/"}>Tokopedia</Link>
                </li>
                <li className="text-base sm:text-lg hover:underline">
                  <Link href={"https://www.lazada.com/"}>Lazada</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start">
              <h5 className="text-lg sm:text-xl font-semibold">
                Connect with us
              </h5>
              <ul className="space-y-2 mt-2">
                <li className="text-base sm:text-lg hover:underline">
                  <Link href={"https://www.instagram.com/bayuaji_1"}>
                    Instagram
                  </Link>
                </li>
                <li className="text-base sm:text-lg hover:underline">
                  <Link href={"https://www.instagram.com/bayuaji_1"}>
                    Tiktok
                  </Link>
                </li>
                <li className="text-base sm:text-lg hover:underline">
                  <Link href={"https://www.linkedin.com/in/bayuajinugroho17/"}>
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-base text-gray-200 tracking-wide">
            ⓒ 2025 •
            <Link
              href={"https://www.github.com/bayuaji17/perfume-apps"}
              className="uppercase font-bold"
            >
              Bandev
            </Link>
            • All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
