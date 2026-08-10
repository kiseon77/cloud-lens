import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

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
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>{data}</CardContent>
      {footer.length > 0 && <CardFooter className="px-4">{footer}</CardFooter>}
    </Card>
  );
}
