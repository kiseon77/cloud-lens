import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

//이번 달 총비용 + 전월 대비 증감률(%) 배지 표시
export default function SummaryCard({
  title,
  data,
  footer,
}: {
  title: string;
  data: string;
  footer: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 text-2xl font-semibold">
        {data}
      </CardContent>
      {footer.length > 0 && (
        <CardFooter className="px-4 text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
