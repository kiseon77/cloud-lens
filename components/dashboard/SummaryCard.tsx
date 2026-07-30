import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

//이번 달 총비용 + 전월 대비 증감률(%) 배지 표시
export default function SummaryCard() {
  return (
    <Card>
      <CardHeader>이번 달 총 비용</CardHeader>
      <CardContent></CardContent>
      <CardFooter className="px-4">전월 대비 %</CardFooter>
    </Card>
  );
}
