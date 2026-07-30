"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableHeader } from "../ui/table";
import { CostData } from "@/app/cost/page";
import { Badge } from "../ui/badge";

//TanStack Table 기반, 정렬·컬럼 리사이즈·페이지네이션 지원하는 메인 테이블
export default function CostDataTable({ costData }: { costData: CostData[] }) {
  console.log("CostDataTable costData:", costData);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<CostData>[]>(
    () => [
      {
        accessorKey: "resource_name",
        header: () => <span>리소스 명</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "service",
        header: () => <span>서비스</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "region",
        header: () => <span>리전</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "tags",
        header: () => <span>태그</span>,
        cell: (info) => {
          const tags = info.getValue() as Record<string, string>;
          return Object.entries(tags).map(([key, value]) => (
            <Badge key={key}>{value}</Badge>
          ));
        },
      },
      {
        accessorKey: "daily_cost",
        header: () => <span>일일비용</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "monthly_cost",
        header: () => <span>월비용</span>,
        cell: (info) => info.getValue(),
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: costData,
    debugTable: true,
    rowCount: costData.length,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableSorting: true,
  });

  return (
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
  );
}
