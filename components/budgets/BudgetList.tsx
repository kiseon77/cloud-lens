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
import type { BudgetList as BudgetListItem } from "@/lib/type";
import { Slider } from "../ui/slider";

export default function BudgetList({
  data,
  className,
}: {
  data: BudgetListItem[];
  className?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<BudgetListItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => <span>팀/프로젝트</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "monthly_limit",
        header: () => <span>월 예산</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "current_spend",
        header: () => <span>현재 소진</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "threshold_percent",
        header: () => <span>진행률</span>,
        cell: (info) => {
          return <Slider value={info.getValue() as number} min={0} max={100} />;
        },
      },
    ],
    [],
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
