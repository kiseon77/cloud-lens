import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useBudgetScopeOptions from "@/lib/hooks/useBudgetScopeOptions";
import useFormattedNumber from "@/lib/hooks/useFormattedNumber";
import { useEffect, useMemo } from "react";
import useAddBudget from "@/lib/hooks/usePostAddBudget";
import useUpdateBudget from "@/lib/hooks/useUpdateBudget";

interface BudgetData {
  id?: string | number;
  scope_type?: string;
  scope_value?: string;
  monthly_limit?: string | number;
}

export default function BudgetForm({
  budgetForm,
  setBudgetForm,
  budgetSearchData,
}: {
  budgetForm: {
    scope_type: string;
    scope_value: string;
    monthly_limit: string | number;
  };
  setBudgetForm: React.Dispatch<React.SetStateAction<any>>;
  budgetSearchData: BudgetData | null;
}) {
  const { data: budgetTeamScopeOptionsData } = useBudgetScopeOptions("TEAM");
  const { data: budgetProjScopeOptionsData } = useBudgetScopeOptions("PROJECT");

  const { mutate: addBudget, isPending: isAddPending } = useAddBudget();
  const { mutate: updateBudget, isPending: isUpdatePending } =
    useUpdateBudget();

  // budgetSearchData에 id가 있으면 기존에 등록된 예산 -> 수정 모드
  const isEditMode = Boolean(budgetSearchData?.id);
  const isPending = isEditMode ? isUpdatePending : isAddPending;

  const handleSelectChange = (value: string) => {
    const [type, val] = value.split(":");

    setBudgetForm((prev: any) => ({
      ...prev,
      scope_type: type.trim().toUpperCase(),
      scope_value: val.trim(),
      monthly_limit: "",
    }));
  };

  useEffect(() => {
    if (budgetSearchData && budgetSearchData.monthly_limit !== undefined) {
      setBudgetForm((prev: any) => ({
        ...prev,
        monthly_limit: budgetSearchData.monthly_limit ?? "",
      }));
    }
  }, [budgetSearchData, setBudgetForm]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");

    setBudgetForm((prev: any) => ({
      ...prev,
      monthly_limit: rawValue,
    }));
  };

  const handleSubmit = () => {
    if (
      !budgetForm.scope_type ||
      !budgetForm.scope_value ||
      !budgetForm.monthly_limit
    ) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    const payload = {
      scope_type: budgetForm.scope_type.toLowerCase(),
      scope_value: budgetForm.scope_value,
      monthly_limit: Number(budgetForm.monthly_limit),
    };

    if (isEditMode) {
      updateBudget(
        {
          id: budgetSearchData!.id,
          ...payload,
        },
        {
          onSuccess: () => {
            alert("예산이 성공적으로 수정되었습니다!");
          },
          onError: (error: Error) => {
            alert(`수정 중 오류가 발생했습니다: ${error.message}`);
          },
        },
      );
      return;
    }

    addBudget(payload, {
      onSuccess: () => {
        alert("예산이 성공적으로 저장되었습니다!");
      },
      onError: (error: Error) => {
        alert(`저장 중 오류가 발생했습니다: ${error.message}`);
      },
    });
  };

  const selectedValue =
    budgetForm.scope_type && budgetForm.scope_value
      ? `${budgetForm.scope_type.toUpperCase()}:${budgetForm.scope_value}`
      : "";

  const limitValFormat = useFormattedNumber(budgetForm.monthly_limit);

  const cardTitle = useMemo(
    () => (isEditMode ? "예산 수정" : "새 예산 등록"),
    [isEditMode],
  );
  const submitLabel = useMemo(() => {
    if (isPending) return isEditMode ? "수정 중..." : "저장 중...";
    return isEditMode ? "수정" : "저장";
  }, [isEditMode, isPending]);

  return (
    <Card>
      <CardHeader className="font-bold text-lg">{cardTitle}</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select value={selectedValue} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="팀 / 프로젝트 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="font-semibold text-xs text-muted-foreground">
                팀
              </SelectLabel>
              {budgetTeamScopeOptionsData?.map((option: string) => (
                <SelectItem key={`TEAM:${option}`} value={`TEAM:${option}`}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>

            <SelectGroup>
              <SelectLabel className="font-semibold text-xs text-muted-foreground mt-2">
                프로젝트
              </SelectLabel>
              {budgetProjScopeOptionsData?.map((option: string) => (
                <SelectItem
                  key={`PROJECT:${option}`}
                  value={`PROJECT:${option}`}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          type="text"
          inputMode="numeric"
          placeholder="월 예산 ($)"
          value={limitValFormat || ""}
          onChange={handleAmountChange}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
          {submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
