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
import { Table, TableBody, TableHeader } from "../ui/table";
import { BudgetList } from "@/lib/type";
import { Switch } from "../ui/switch";
import useToggleAlertRule from "@/lib/hooks/useToggleAlertRule";

export default function AlertRuleList({
  data,
  className,
}: {
  data: BudgetList[];
  className?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { mutate: toggleActive, isPending, variables } = useToggleAlertRule();

  const columns = useMemo<ColumnDef<BudgetList>[]>(
    () => [
      {
        accessorKey: "description",
        header: () => <span>규칙</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "channel",
        header: () => <span>채널</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "is_active",
        header: () => <span>상태</span>,
        cell: (info) => {
          const is_active = info.getValue() as boolean;
          return is_active ? "활성" : "비활성";
        },
      },
      {
        id: "is_active_toggle",
        header: () => <span></span>,
        cell: ({ row }) => {
          const rule = row.original as BudgetList & {
            id: string | number;
            is_active: boolean;
          };
          const isRowPending = isPending && variables?.id === rule.id;

          return (
            <Switch
              checked={rule.is_active}
              disabled={isRowPending}
              onCheckedChange={(checked: boolean) => {
                toggleActive({ id: rule.id, is_active: checked });
              }}
            />
          );
        },
      },
    ],
    [isPending, variables, toggleActive],
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
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
