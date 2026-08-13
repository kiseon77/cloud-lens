"use client";

import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import type { BudgetList as BudgetListItem } from "@/lib/type";
import { Slider } from "../ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import {
  getBudgetUsagePercent,
  NEAR_THRESHOLD_GAP_PERCENT,
} from "@/lib/budget";

interface AlertRuleSummary {
  budget_id: string | number;
  is_active: boolean;
}

export default function BudgetList({
  data,
  alertRules = [],
  className,
}: {
  data: BudgetListItem[];
  alertRules?: AlertRuleSummary[];
  className?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const activeAlertBudgetIds = useMemo(
    () =>
      new Set(
        alertRules
          .filter((rule) => rule.is_active)
          .map((rule) => rule.budget_id),
      ),
    [alertRules],
  );

  const columns = useMemo<ColumnDef<BudgetListItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => <span>팀/프로젝트</span>,
        cell: (info) => (
          <span className="block truncate">{info.getValue() as string}</span>
        ),
        size: 200,
      },
      {
        accessorKey: "monthly_limit",
        header: () => <span className="block text-right">월 예산</span>,
        cell: (info) => (
          <span className="block text-right">
            {(info.getValue() as number).toLocaleString()}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "current_spend",
        header: () => <span className="block text-right">현재 소진</span>,
        cell: (info) => (
          <span className="block text-right">
            {(info.getValue() as number).toLocaleString()}
          </span>
        ),
        size: 120,
      },
      {
        id: "usage_percent",
        header: () => <span className="block text-center">진행률</span>,
        cell: ({ row }) => {
          const budget = row.original;
          const usagePercent = getBudgetUsagePercent(
            budget.current_spend,
            budget.monthly_limit,
          );
          const hasActiveAlert = activeAlertBudgetIds.has(budget.id);
          const isNearThreshold =
            !hasActiveAlert &&
            usagePercent >= budget.threshold_percent - NEAR_THRESHOLD_GAP_PERCENT;

          return (
            <Tooltip>
              <TooltipTrigger render={<div className="w-full" />}>
                <Slider
                  value={usagePercent}
                  min={0}
                  max={100}
                  className={cn(
                    hasActiveAlert &&
                      "**:data-[slot=slider-range]:bg-destructive",
                    isNearThreshold &&
                      "**:data-[slot=slider-range]:bg-yellow-500",
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>{usagePercent}% 사용</TooltipContent>
            </Tooltip>
          );
        },
        size: 200,
      },
    ],
    [activeAlertBudgetIds],
  );

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableSorting: true,
  });

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
