import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Anomaly } from "@/lib/type";
import { getAnomalyPercent } from "@/lib/anomaly";
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
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            이상 비용 경고
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data.map((item) => AlertText(item))} {data.length > 1 && "•"}
        </CardContent>
      </Card>
    </Dialog>
  );
}

const AlertText = (item: Anomaly) => {
  return (
    <div key={`${item.service}-${item.region}`}>
      {item.service} ({item.region}) 전일 대비 +{getAnomalyPercent(item)}%
      급증
    </div>
  );
};
