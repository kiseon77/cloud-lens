"use client";

import { useEffect, useState } from "react";

import CostDataTable from "@/components/cost/CostDataTable";
import ExportCsvButton from "@/components/cost/ExportCsvButton";
import FilterBar from "@/components/cost/FilterBar";
import Pagination from "@/components/cost/Pagination";
import SearchInput from "@/components/cost/SearchInput";

import { supabase } from "@/lib/supabase/client";
import page from "../budgets/page";

export interface CostData {
  id: number;
  resource_name: string;
  service: string;
  region: string;
  tags: Record<string, string>;
  daily_cost: number;
  monthly_cost: number;
}

export default function Cost() {
  const filterData = [
    { label: "서비스", value: "service" },
    { label: "리전", value: "region" },
    { label: "태그", value: "tag" },
  ];

  const [costData, setCostData] = useState<CostData[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const getData = async () => {
      const { data, count, error }: { data: CostData[]; count: number } =
        await supabase
          .from("resource_costs")
          .select("*", { count: "exact" })
          .range(page * pageSize, (page + 1) * pageSize - 1);
      setCostData(data);
    };
    getData();
  }, []);

  return (
    <main className="flex  w-full flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
      <section className="flex w-full items-center justify-between gap-4">
        <SearchInput />
        {filterData.map((filter) => (
          <FilterBar
            key={filter.value}
            label={filter.label}
            value={filter.value}
          />
        ))}
        <ExportCsvButton />
      </section>
      <CostDataTable costData={costData} />
      <Pagination />
    </main>
  );
}
