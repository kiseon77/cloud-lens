"use client";

import AlertRuleForm from "@/components/budgets/AlertRuleForm";
import AlertRuleList from "@/components/budgets/AlertRuleList";
import BudgetForm from "@/components/budgets/BudgetForm";
import BudgetList from "@/components/budgets/BudgetList";
import Pagination from "@/components/cost/Pagination";
import useGetBudgetList from "@/lib/hooks/useGetBudgetList";
import useGetRuleList from "@/lib/hooks/useGetRuleList";
import { useState } from "react";

export default function Budgets() {
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = Math.ceil((budgetList?.count || 0) / pageSize);
  return (
    <div className="flex  w-full flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
      <main className=" w-full grid grid-cols-2 gap-y-8 gap-x-4">
        <BudgetForm />
        <AlertRuleForm />

        <div className="col-span-2 flex flex-col gap-4">
          <BudgetList data={budgetList?.data || []} />
          {totalPages > pageSize && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>

        <AlertRuleList data={ruleList?.data || []} className="col-span-2" />
      </main>
    </div>
  );
}
