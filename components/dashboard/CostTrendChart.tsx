import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CostTrend } from "@/lib/type";
//Recharts AreaChart/LineChart, 최근 30일 일별 비용 추이
export default function CostTrendChart({
  className,
  data,
}: {
  className?: string;
  data: CostTrend<"region">[];
}) {
  return (
    <Card className={className}>
      <CardHeader>일별 비용 추이(30일)</CardHeader>
      <CardContent>
        <LineChart
          style={{ width: "97%", aspectRatio: 2, maxWidth: 600 }}
          responsive
          data={data}
        >
          <CartesianGrid />
          <Line dataKey="total_cost" />
          <XAxis
            dataKey="date"
            interval={2}
            tickFormatter={(value: string) => value.slice(5).replace("-", ".")}
            angle={-20}
            height={30}
          />
          <YAxis width={30} />
        </LineChart>
      </CardContent>
    </Card>
  );
}
