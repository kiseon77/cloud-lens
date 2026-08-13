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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
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
        header: () => <span className="block text-center">서비스</span>,
        cell: (info) => (
          <span className="block text-center">
            {info.getValue() as string}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "region",
        header: () => <span className="block text-center">리전</span>,
        cell: (info) => (
          <span className="block text-center">
            {info.getValue() as string}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "tags",
        header: () => <span className="block text-center">태그</span>,
        cell: (info) => {
          const tags = info.getValue() as Record<string, string>;
          return (
            <div className="flex justify-center">
              <Badge>{tags.Team}</Badge>
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: "daily_cost",
        header: () => <span className="block text-right">일일비용</span>,
        cell: (info) => (
          <span className="block text-right">
            {(info.getValue() as number).toLocaleString()}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "monthly_cost",
        header: () => <span className="block text-right">월비용</span>,
        cell: (info) => (
          <span className="block text-right">
            {(info.getValue() as number).toLocaleString()}
          </span>
        ),
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
  );
}
