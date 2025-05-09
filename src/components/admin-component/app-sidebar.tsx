"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Component, PackageSearch, Link2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";

const data = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Perfumes",
    url: "/dashboard/perfumes",
    icon: PackageSearch,
  },
  {
    title: "Brand",
    url: "/dashboard/brands",
    icon: Component,
  },
  {
    title: "Checkout Links",
    url: "/dashboard/checkout-links",
    icon: Link2,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="text-center p-4">
        <Link href={"/"}>
          <h1>Zalisma Perfumes</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.title} className={`px-2`}>
              <SidebarMenuButton
                asChild
                className={`${
                  pathname === item.url ? "bg-black text-white" : ""
                } hover:bg-black hover:text-white`}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
