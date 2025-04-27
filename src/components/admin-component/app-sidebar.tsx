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
import { Component, LayoutDashboard, PackageSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Button } from "../ui/button";
// import { signOut } from "next-auth/react";
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
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1>Zalisma Perfumes</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.title} className={`px-2`}>
              <SidebarMenuButton asChild className={`${
                    pathname === item.url ? "bg-black text-white" : ""
                  } hover:bg-black hover:text-white`}>
                <Link
                  href={item.url}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
          <SidebarFooter>
            <LogoutButton/>
            {/* <Button variant={"destructive"} onClick={() => signOut()}>Logout</Button> */}
          </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
