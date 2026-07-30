import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Dialog } from "../ui/dialog";
//	전일 대비 일정 비율(예: +30%) 이상 급증한 서비스/리소스를 리스트업하는 경고 카드
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
