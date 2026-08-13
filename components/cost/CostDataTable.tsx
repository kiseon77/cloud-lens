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
import { Badge } from "../ui/badge";
import { CostData } from "@/lib/type";

//TanStack Table 기반, 정렬·컬럼 리사이즈·페이지네이션 지원하는 메인 테이블
export default function CostDataTable({ data }: { data: CostData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<CostData>[]>(
    () => [
      {
        accessorKey: "resource_name",
        header: () => <span>리소스 명</span>,
        cell: (info) => (
          <span className="block truncate">{info.getValue() as string}</span>
        ),
        size: 240,
      },
      {
        accessorKey: "service",
        header: () => <span>서비스</span>,
        cell: (info) => info.getValue(),
        size: 120,
      },
      {
        accessorKey: "region",
        header: () => <span>리전</span>,
        cell: (info) => info.getValue(),
        size: 120,
      },
      {
        accessorKey: "tags",
        header: () => <span>태그</span>,
        cell: (info) => {
          const tags = info.getValue() as Record<string, string>;
          return <Badge>{tags.Team}</Badge>;
        },
        size: 120,
      },
      {
        accessorKey: "daily_cost",
        header: () => <span>일일비용</span>,
        cell: (info) => info.getValue(),
        size: 120,
      },
      {
        accessorKey: "monthly_cost",
        header: () => <span>월비용</span>,
        cell: (info) => info.getValue(),
        size: 120,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: data,
    debugTable: true,
    rowCount: data.length,
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
              <th key={header.id} style={{ width: header.getSize() }}>
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
              <td key={cell.id} style={{ width: cell.column.getSize() }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </TableBody>
    </Table>
  );
}
