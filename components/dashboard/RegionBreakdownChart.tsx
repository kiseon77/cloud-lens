import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function RegionBreakdownChart({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>리전별 비용</CardHeader>
      <CardContent>
        <p>막대 그래프</p>
      </CardContent>
    </Card>
  );
}
