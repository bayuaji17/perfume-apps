import { AppSidebar } from "@/components/admin-component/app-sidebar";
import DynamicBreadCrumb from "@/components/admin-component/dynamic-breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="font-sans">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadCrumb />
        </header>
        <div className="p-4 rounded-xl">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
