import React from "react";
import { TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog } from "../ui/dialog";
import { Anomaly } from "@/lib/type";
import { getAnomalyPercent } from "@/lib/anomaly";
import { cn } from "@/lib/utils";

export default function AnomalyAlertCard({
  className,
  data = [],
}: {
  className?: string;
  data: Anomaly[];
}) {
  const hasAnomaly = data.length > 0;

  return (
    <Dialog>
      <Card
        className={cn(
          hasAnomaly &&
            "border-destructive/50 bg-destructive/5 ring-destructive/30",
          className,
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "flex items-center gap-1.5",
              hasAnomaly ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {hasAnomaly && (
              <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
            )}
            이상 비용 경고
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {hasAnomaly ? (
            data.map((item) => AlertText(item))
          ) : (
            <span className="text-sm text-muted-foreground">
              감지된 이상 비용이 없습니다.
            </span>
          )}
        </CardContent>
      </Card>
    </Dialog>
  );
}

const AlertText = (item: Anomaly) => {
  return (
    <Badge
      key={`${item.service}-${item.region}`}
      variant="destructive"
      className="h-auto py-1 text-xs font-medium"
    >
      {item.service} ({item.region}) 전일 대비 +{getAnomalyPercent(item)}%
      급증
    </Badge>
  );
};
