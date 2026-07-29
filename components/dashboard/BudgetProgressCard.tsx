import React from "react";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

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
