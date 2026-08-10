import React from "react";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BudgetLimit } from "@/lib/type";
export default function BudgetProgressCard({
  totalLimit,
  data,
}: {
  totalLimit: number;
  data: BudgetLimit[];
}) {
  return (
    <Card>
      <CardHeader>예산 소진율</CardHeader>
      <CardContent>
        {totalLimit}%
        <Slider value={totalLimit} />
      </CardContent>
      <CardFooter className="px-4 flex-col ">
        {data.map((data) => DetailFooter(data))}
      </CardFooter>
    </Card>
  );
}

const DetailFooter = (data: BudgetLimit) => {
  return (
    <div className="w-full py-2" key={data.scope_value}>
      {data.scope_value} ({data.threshold_percent}%)
      <Slider value={data.threshold_percent} />
    </div>
  );
};
