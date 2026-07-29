import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Dialog } from "../ui/dialog";

export default function AnomalyAlertCard({
  className,
}: {
  className?: string;
}) {
  return (
    <Dialog>
      <Card className={className}>
        <CardHeader>이상 비용 경고</CardHeader>
        <CardContent>
          <p>이상 탐지 알림 내용</p>
        </CardContent>
      </Card>
    </Dialog>
  );
}
