import React from "react";
import { Slider } from "../ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../ui/accordion";
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle
          className={cn(
            "text-muted-foreground",
            isWarning && "text-destructive",
          )}
        >
          예산 소진율
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <span
          className={cn(
            "text-2xl font-semibold",
            isWarning && "text-destructive",
          )}
        >
          {totalLimit}%
        </span>
        <Slider
          value={[totalLimit]}
          className={cn(
            isWarning && "**:data-[slot=slider-range]:bg-destructive",
          )}
        />
      </CardContent>
      <CardFooter className="px-4 flex-col">
        <Accordion className="w-full">
          <AccordionItem className="border-b-0">
            <AccordionTrigger className="py-0 text-sm text-muted-foreground">
              팀/프로젝트별 소진율 ({data.length})
            </AccordionTrigger>
            <AccordionPanel>
              <div className="flex flex-col pt-2">
                {data.map((item) => DetailFooter(item))}
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
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
      <span
        className={cn(
          "text-sm text-muted-foreground",
          isWarning && "text-destructive font-semibold",
        )}
      >
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
