import AnomalyAlertCard from "@/components/dashboard/AnomalyAlertCard";
import BudgetProgressCard from "@/components/dashboard/BudgetProgressCard";
import CostTrendChart from "@/components/dashboard/CostTrendChart";
import RegionBreakdownChart from "@/components/dashboard/RegionBreakdownChart";
import ServiceBreakdownChart from "@/components/dashboard/ServiceBreakdownChart";
import SummaryCard from "@/components/dashboard/SummaryCard";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" w-full max-w-3xl py-10 px-8 grid grid-cols-3 gap-4">
        <SummaryCard />
        <BudgetProgressCard />
        <SummaryCard />
        <AnomalyAlertCard className="col-span-3" />
        <CostTrendChart className="col-span-2" />
        <ServiceBreakdownChart className="col-span-1" />
        <RegionBreakdownChart className="col-span-3" />
      </main>
    </div>
  );
}
