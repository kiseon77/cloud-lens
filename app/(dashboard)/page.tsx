"use client";
import AnomalyAlertCard from "@/components/dashboard/AnomalyAlertCard";
import BudgetProgressCard from "@/components/dashboard/BudgetProgressCard";
import CostTrendChart from "@/components/dashboard/CostTrendChart";
import RegionBreakdownChart from "@/components/dashboard/RegionBreakdownChart";
import ServiceBreakdownChart from "@/components/dashboard/ServiceBreakdownChart";
import SummaryCard from "@/components/dashboard/SummaryCard";
import useBudgetLimit from "@/lib/hooks/useBudgetLimit";
import useCostAnomalies from "@/lib/hooks/useCostAnomalies";
import useCostTrend from "@/lib/hooks/useCostTrend";
import useMonthCost from "@/lib/hooks/useMonthCost";
import useRegionBreakdownChart from "@/lib/hooks/useRegionBreakdownChart";
import useServiceBreakdownChart from "@/lib/hooks/useServiceBreakdownChart";
import { detectAnomalies } from "@/lib/anomaly";
import { getTotalBudgetUsagePercent } from "@/lib/budget";

export default function Home() {
  const {
    data: ThisMonthCostData,
    isLoading: ThisMonthCostLoading,
    error: ThisMonthCostError,
  } = useMonthCost({
    getMonthNumber: new Date().getMonth() + 1,
  });
  const {
    data: BeforeMonthCostData,
    isLoading: BeforeMonthCostLoading,
    error: BeforeMonthCostError,
  } = useMonthCost({
    getMonthNumber: new Date().getMonth(),
  });
  const {
    data: costAnomaliesData,
    isLoading: costAnomaliesLoading,
    error: costAnomaliesError,
  } = useCostAnomalies();

  const {
    data: budgetLimitData,
    isLoading: budgetLimitLoading,
    error: budgetLimitError,
  } = useBudgetLimit();
  const {
    data: dailyCostData,
    isLoading: dailyCostLoading,
    error: dailyCostError,
  } = useCostTrend();
  const {
    data: regionBreakdownChartData,
    isLoading: regionBreakdownChartLoading,
    error: regionBreakdownChartError,
  } = useRegionBreakdownChart();

  const {
    data: serviceBreakdownChartData,
    isLoading: serviceBreakdownChartLoading,
    error: serviceBreakdownChartError,
  } = useServiceBreakdownChart();

  const monthCostDataFooterText = () => {
    if (
      ThisMonthCostData?.data === undefined ||
      BeforeMonthCostData?.data === undefined
    ) {
      return "";
    }
    const diff = ThisMonthCostData.data - BeforeMonthCostData.data;
    if (diff <= 0 || BeforeMonthCostData.data === 0) {
      return "";
    }
    return `전월 대비 ${((diff / BeforeMonthCostData.data) * 100).toFixed(2)}%`;
  };

  const isDashboardLoading =
    ThisMonthCostLoading ||
    BeforeMonthCostLoading ||
    costAnomaliesLoading ||
    budgetLimitLoading ||
    dailyCostLoading ||
    regionBreakdownChartLoading ||
    serviceBreakdownChartLoading;

  const dashboardError =
    ThisMonthCostError ||
    BeforeMonthCostError ||
    costAnomaliesError ||
    budgetLimitError ||
    dailyCostError ||
    regionBreakdownChartError ||
    serviceBreakdownChartError;

  if (isDashboardLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="py-10 text-sm text-muted-foreground">
          대시보드를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="py-10 text-sm text-destructive">
          데이터를 불러오는 중 오류가 발생했습니다: {dashboardError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" w-full max-w-3xl py-10 px-8 grid grid-cols-3 gap-4">
        <SummaryCard
          title="이번 달 총 비용"
          data={`$ ${(ThisMonthCostData?.data ?? 0).toFixed(2)}`}
          footer={monthCostDataFooterText()}
        />
        <BudgetProgressCard
          totalLimit={getTotalBudgetUsagePercent(budgetLimitData?.data || [])}
          data={budgetLimitData?.data || []}
        />
        <SummaryCard
          title="이상 비용 건수"
          data={String(costAnomaliesData?.data.length ?? 0)}
          footer="최근 7일"
        />
        <AnomalyAlertCard
          className="col-span-3"
          data={detectAnomalies(costAnomaliesData?.data)}
        />
        <CostTrendChart className="col-span-2" data={dailyCostData?.data} />
        <ServiceBreakdownChart
          className="col-span-1"
          data={serviceBreakdownChartData?.data}
        />
        <RegionBreakdownChart
          className="col-span-3"
          data={regionBreakdownChartData?.data}
        />
      </main>
    </div>
  );
}
