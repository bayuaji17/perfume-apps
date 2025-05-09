import QuickActions from "@/components/admin-component/quick-actions";
import TotalCards from "@/components/admin-component/total-card";
import { Zap } from "lucide-react";

export default function DashboardPages() {
  return (
    <>
      <h1 className="text-5xl font-bold">Dashboard</h1>
      <p className="text-lg">Overview of your perfume inventory</p>
      {/* Cards */}
      <TotalCards />
      {/* Quick ACtions */}
      <div className="flex flex-col gap-2">
        <h1 className="flex gap-2 font-bold text-3xl items-center underline">
          Quick Actions
          <span>
            <Zap />
          </span>
        </h1>
        <QuickActions />
      </div>
    </>
  );
}
