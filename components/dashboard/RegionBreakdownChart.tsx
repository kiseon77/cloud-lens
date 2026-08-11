import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CostTrend } from "@/lib/type";
//리전별 비용 바차트
export default function RegionBreakdownChart({
  data,
  className,
}: {
  data: CostTrend<"region">[];
  className?: string;
}) {
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
  ];
  return (
    <Card className={className}>
      <CardHeader>리전별 비용</CardHeader>
      <CardContent>
        <BarChart width={600} height={300} data={data}>
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_cost" radius={[4, 4, 0, 0]}>
            {data?.map((_, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </CardContent>
    </Card>
  );
}
