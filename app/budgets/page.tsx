"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AlertRuleForm from "@/components/budgets/AlertRuleForm";
import AlertRuleList from "@/components/budgets/AlertRuleList";
import BudgetForm from "@/components/budgets/BudgetForm";
import BudgetList from "@/components/budgets/BudgetList";
import Pagination from "@/components/cost/Pagination";
import useBudgetScopeOptions from "@/lib/hooks/useBudgetScopeOptions";
import useBudgetSearch from "@/lib/hooks/useBudgetSearch";
import useGetBudgetList from "@/lib/hooks/useGetBudgetList";
import useGetRuleList from "@/lib/hooks/useGetRuleList";
import useGetTagList from "@/lib/hooks/useGetTagList";
import { useState } from "react";

export default function Budgets() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [budgetForm, setBudgetForm] = useState({
    scope_type: "",
    scope_value: "",
    monthly_limit: "",
  });

  const {
    data: budgetList,
    isLoading: isBudgetListLoading,
    error: budgetListError,
  } = useGetBudgetList();
  const {
    data: ruleList,
    isLoading: isRuleListLoading,
    error: ruleListError,
  } = useGetRuleList();
  const {
    data: budgetSearchData,
    isLoading: isBudgetSearchLoading,
    error: budgetSearchError,
  } = useBudgetSearch(budgetForm.scope_type, budgetForm.scope_value);
  const totalPages = Math.ceil((budgetList?.count || 0) / pageSize);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="grid w-full max-w-5xl grid-cols-2 gap-4 py-10 px-8">
        <BudgetForm
          budgetForm={budgetForm}
          setBudgetForm={setBudgetForm}
          budgetSearchData={budgetSearchData?.data}
        />
        <AlertRuleForm
          budgetId={budgetSearchData?.data?.id}
          budgetData={budgetSearchData?.data}
        />

        <Card className="col-span-2">
          <CardHeader className="font-bold text-lg">예산 목록</CardHeader>
          <CardContent className="flex flex-col gap-4">
            <BudgetList
              data={budgetList?.data || []}
              alertRules={ruleList?.data || []}
            />
            {totalPages > pageSize && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="font-bold text-lg">알람규칙 목록</CardHeader>
          <CardContent>
            <AlertRuleList data={ruleList?.data || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
