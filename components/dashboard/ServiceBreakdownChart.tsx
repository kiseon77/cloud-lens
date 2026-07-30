import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
//서비스별 비용 비중 도넛/파이차트
export default function ServiceBreakdownChart({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>서비스별 비용 분포</CardHeader>
      <CardContent>
        <p>도넛 차트 내용</p>
      </CardContent>
    </Card>
  );
}
