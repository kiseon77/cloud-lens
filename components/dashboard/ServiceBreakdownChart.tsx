import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CostTrend } from "@/lib/type";
//서비스별 비용 비중 도넛/파이차트
export default function ServiceBreakdownChart({
  className,
  data,
}: {
  className?: string;
  data: CostTrend<"service">[];
}) {
  const COLORS = [
    "#ff8042",
    "#ffc658",
    "#d0ed57",
    "#a4de6c",
    "#82ca9d",
    "#8884d8",
  ];
  return (
    <Card className={className}>
      <CardHeader>서비스별 비용 분포</CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total_cost"
              nameKey="service"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={0}
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
