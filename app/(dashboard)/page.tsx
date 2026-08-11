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
import { Anomaly, BudgetLimit } from "@/lib/type";

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
    if (ThisMonthCostData?.data - BeforeMonthCostData?.data > 0) {
      return `전월 대비 ${(((ThisMonthCostData?.data - BeforeMonthCostData?.data) / BeforeMonthCostData?.data) * 100).toFixed(2)}%`;
    }
    return "";
  };

  //통합 소진율
  const monthBudgetLimitCard = (data: BudgetLimit[]) => {
    if (!data || data.length === 0) return;

    const total = data.reduce(
      (acc, curr) => {
        return {
          totalLimit: acc.totalLimit + curr.monthly_limit,
          totalSpend: acc.totalSpend + curr.current_spend,
        };
      },
      { totalLimit: 0, totalSpend: 0 },
    );

    if (total.totalLimit === 0) return 0;

    const totalLimit = (total.totalSpend / total.totalLimit) * 100;

    return Number(totalLimit.toFixed(1));
  };

  //최근 7일 중 이상건수 중, 전일 대비 30% 증감 리스트
  const AnomalyAlertList = (data: Anomaly[]) => {
    if (!data || data.length === 0) return;
    return data.filter(
      (item) =>
        ((item.daily_cost - item.prev_day_cost) / item.prev_day_cost) * 100 >
        30,
    );
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" w-full max-w-3xl py-10 px-8 grid grid-cols-3 gap-4">
        <SummaryCard
          title="이번 달 총 비용"
          data={`$ ${ThisMonthCostData?.data.toFixed(2)}`}
          footer={monthCostDataFooterText()}
        />
        <BudgetProgressCard
          totalLimit={monthBudgetLimitCard(budgetLimitData?.data) || 0}
          data={budgetLimitData?.data || []}
        />
        <SummaryCard
          title="이상 비용 건수"
          data={costAnomaliesData?.data.length}
          footer="최근 7일"
        />
        <AnomalyAlertCard
          className="col-span-3"
          data={AnomalyAlertList(costAnomaliesData?.data) || []}
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
