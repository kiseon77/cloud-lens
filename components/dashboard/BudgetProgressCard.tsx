import React from "react";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BudgetLimit } from "@/lib/type";
import { cn } from "@/lib/utils";
import { isBudgetWarning } from "@/lib/budget";
export default function BudgetProgressCard({
  totalLimit,
  data,
}: {
  totalLimit: number;
  data: BudgetLimit[];
}) {
  const isWarning = isBudgetWarning(totalLimit);
  return (
    <Card>
      <CardHeader className={cn(isWarning && "text-destructive")}>
        예산 소진율
      </CardHeader>
      <CardContent>
        <span className={cn(isWarning && "text-destructive font-semibold")}>
          {totalLimit}%
        </span>
        <Slider
          value={[totalLimit]}
          className={cn(
            isWarning && "**:data-[slot=slider-range]:bg-destructive",
          )}
        />
      </CardContent>
      <CardFooter className="px-4 flex-col ">
        {data.map((item) => DetailFooter(item))}
      </CardFooter>
    </Card>
  );
}

const DetailFooter = (data: BudgetLimit) => {
  const usagePercent =
    data.monthly_limit === 0
      ? 0
      : (data.current_spend / data.monthly_limit) * 100;
  const isWarning = isBudgetWarning(usagePercent);

  return (
    <div className="w-full py-2" key={data.scope_value}>
      <span className={cn(isWarning && "text-destructive font-semibold")}>
        {data.scope_value} ({data.threshold_percent}%)
      </span>
      <Slider
        value={[usagePercent]}
        className={cn(
          isWarning && "**:data-[slot=slider-range]:bg-destructive",
        )}
      />
    </div>
  );
};
