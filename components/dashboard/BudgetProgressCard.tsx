import React from "react";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
//예산 대비 소진율 프로그레스바 (currentSpend / budget), 임계치 초과 시 색상 변경
export default function BudgetProgressCard() {
  return (
    <Card>
      <CardHeader>예산 소진율</CardHeader>
      <CardContent></CardContent>
      <CardFooter className="px-4">
        <Slider />
      </CardFooter>
    </Card>
  );
}
