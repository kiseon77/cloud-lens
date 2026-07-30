import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
//Recharts AreaChart/LineChart, 최근 30일 일별 비용 추이
export default function CostTrendChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>일별 비용 추이(30일)</CardHeader>
      <CardContent>
        <p>비용 추세 차트 내용</p>
      </CardContent>
    </Card>
  );
}
