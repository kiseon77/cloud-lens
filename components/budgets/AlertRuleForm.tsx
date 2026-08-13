"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import useAlertRuleSearch from "@/lib/hooks/useAlertRuleSearch";
import useAddAlertRule from "@/lib/hooks/useAddAlertRule";
import useUpdateAlertRule from "@/lib/hooks/useUpdateAlertRule";
import useUpdateBudget from "@/lib/hooks/useUpdateBudget";
import { ThresholdSlider } from "../ui/thresholdSlider";

type Channel = "email" | "slack";

interface BudgetData {
  id?: string | number;
  scope_value?: string;
  threshold_percent?: number;
  alert_channel?: string | null;
  is_active?: boolean;
}

export default function AlertRuleForm({
  budgetId,
  budgetData,
}: {
  budgetId?: string | number | null;
  budgetData?: BudgetData | null;
}) {
  const [description, setDescription] = useState("");
  const [threshold, setThreshold] = useState(80);
  const [channel, setChannel] = useState<Channel | null>(null);

  const { data: alertRuleSearchData, isLoading: isAlertRuleLoading } =
    useAlertRuleSearch(budgetId);
  const existingRule = alertRuleSearchData?.data ?? null;
  const isEditMode = Boolean(existingRule?.id);

  const { mutate: addAlertRule, isPending: isAddPending } = useAddAlertRule();
  const { mutate: updateAlertRule, isPending: isUpdatePending } =
    useUpdateAlertRule();
  const { mutate: updateBudget, isPending: isBudgetUpdatePending } =
    useUpdateBudget();

  const isPending =
    isAddPending ||
    isUpdatePending ||
    isBudgetUpdatePending ||
    isAlertRuleLoading;

  // 예산(budgetId)이 바뀌거나, 해당 예산에 등록된 규칙 조회 결과가 오면
  // 기존 값이 있으면 그대로 채워주고, 없으면 budgets 테이블의 값을 기본값으로 사용합니다.
  useEffect(() => {
    if (!budgetId) {
      setDescription("");
      setThreshold(80);
      setChannel(null);
      return;
    }

    const nextThreshold =
      budgetData?.threshold_percent !== undefined &&
      budgetData?.threshold_percent !== null
        ? budgetData.threshold_percent
        : 80;

    // 기존 규칙이 있으면 description은 비워두고 플레이스홀더로만 보여줍니다
    // (미입력 시 저장 단계에서 기존 값을 그대로 유지). 신규 작성 시에는
    // 팀/임계치를 반영한 템플릿을 기본값으로 채워줍니다.
    setDescription(
      existingRule
        ? ""
        : budgetData?.scope_value
          ? `${budgetData.scope_value} 예산 ${nextThreshold}% 초과 시`
          : "",
    );
    setChannel(
      (existingRule?.channel as Channel | undefined) ??
        (budgetData?.alert_channel as Channel | undefined) ??
        null,
    );
    setThreshold(nextThreshold);
  }, [budgetId, existingRule, budgetData]);

  const handleChannelSelect = (value: Channel) => {
    // 단일 선택: 같은 값을 다시 누르면 선택 해제, 다른 값을 누르면 교체
    setChannel((prev) => (prev === value ? null : value));
  };

  const handleSubmit = () => {
    if (!budgetId) {
      alert("먼저 예산(팀/프로젝트)을 선택해 주세요.");
      return;
    }
    if (!channel) {
      alert("알림 채널을 선택해 주세요.");
      return;
    }

    const onError = (error: Error) => {
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    };
    const onSaved = () => {
      alert(
        isEditMode
          ? "알림 규칙이 수정되었습니다!"
          : "알림 규칙이 저장되었습니다!",
      );
    };

    // budgets 테이블의 임계치/채널 값도 함께 최신화합니다.
    updateBudget(
      {
        id: budgetId,
        threshold_percent: threshold,
        alert_channel: channel,
        is_active: true,
      },
      { onError },
    );

    if (isEditMode) {
      updateAlertRule(
        {
          id: existingRule.id,
          description: description || existingRule.description,
          channel,
          is_active: true,
        },
        { onSuccess: onSaved, onError },
      );
    } else {
      addAlertRule(
        {
          budget_id: budgetId,
          description,
          channel,
          is_active: true,
        },
        { onSuccess: onSaved, onError },
      );
    }
  };

  return (
    <Card>
      <CardHeader className="font-bold text-lg flex justify-between">
        <p>{isEditMode ? "알람규칙 수정" : "알람규칙"}</p>
        <Input
          className="w-2/3"
          type="text"
          placeholder={
            existingRule?.description ||
            "규칙 설명 (예: backend 예산 80% 초과 시)"
          }
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <label
            id="threshold-slider-label"
            htmlFor="threshold-slider"
            className="text-sm text-muted-foreground mb-1 block"
          >
            임계치 {threshold}%
          </label>
          <ThresholdSlider
            id="threshold-slider"
            aria-labelledby="threshold-slider-label"
            // budgetId(예산)가 바뀔 때만 새 기본값으로 리마운트되도록 key를 줍니다.
            // value를 매번 controlled로 넘기면 드래그 중 리렌더와 충돌해
            // 마우스를 따라오지 않거나 값이 튀는 문제가 생겨서, 드래그 중에는
            // uncontrolled(defaultValue)로 두고 onValueChange로만 상태를 동기화합니다.
            key={`${budgetId ?? "none"}-${existingRule?.id ?? "new"}`}
            defaultValue={[threshold]}
            min={0}
            max={100}
            step={1}
            onValueChange={(vals: number | readonly number[]) => {
              const next = Array.isArray(vals) ? vals[0] : vals;
              if (typeof next === "number" && !Number.isNaN(next)) {
                setThreshold(next);
              }
            }}
          />
        </div>

        <div className="flex gap-2" role="radiogroup" aria-label="알림 채널">
          <Button
            type="button"
            variant={channel === "email" ? "default" : "outline"}
            aria-pressed={channel === "email"}
            onClick={() => handleChannelSelect("email")}
          >
            이메일
          </Button>
          <Button
            type="button"
            variant={channel === "slack" ? "default" : "outline"}
            aria-pressed={channel === "slack"}
            onClick={() => handleChannelSelect("slack")}
          >
            슬랙
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "저장 중..." : isEditMode ? "수정" : "저장"}
        </Button>
      </CardFooter>
    </Card>
  );
}
