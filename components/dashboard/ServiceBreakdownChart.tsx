import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

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
