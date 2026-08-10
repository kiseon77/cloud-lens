import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Anomaly } from "@/lib/type";
export default function AnomalyAlertCard({
  className,
  data = [],
}: {
  className?: string;
  data: Anomaly[];
}) {
  return (
    <Dialog>
      <Card className={className}>
        <CardHeader>이상 비용 경고</CardHeader>
        <CardContent className="flex ">
          {data.map((item) => AlertText(item))} {data.length > 1 && "•"}
        </CardContent>
      </Card>
    </Dialog>
  );
}

const AlertText = (item: Anomaly) => {
  return (
    <div key={(item.service, item.region)}>
      {item.service} ({item.region}) 전일 대비 +
      {Math.round((item.daily_cost - item.prev_day_cost) / item.prev_day_cost) *
        100}
      % 급증
    </div>
  );
};
