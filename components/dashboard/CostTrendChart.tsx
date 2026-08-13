import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
      <CardHeader>
        <CardTitle className="text-muted-foreground">
          일별 비용 추이(30일)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart data={data}>
            <CartesianGrid />
            <Line dataKey="total_cost" />
            <XAxis
              dataKey="date"
              interval={2}
              tickFormatter={(value: string) =>
                value.slice(5).replace("-", ".")
              }
              angle={-20}
              height={30}
            />
            <YAxis width={30} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
