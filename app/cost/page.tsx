"use client";

import { useEffect, useState } from "react";

import CostDataTable from "@/components/cost/CostDataTable";
import ExportCsvButton from "@/components/cost/ExportCsvButton";
import FilterBar from "@/components/cost/FilterBar";
import Pagination from "@/components/cost/Pagination";
import SearchInput from "@/components/cost/SearchInput";

import { useDebounce } from "@/lib/hooks/useDebounce";
import { REGION_OPTIONS, SERVICE_OPTIONS } from "@/lib/constants";
import useResourceData from "@/lib/hooks/useResourceCosts";
import useGetTagList from "@/lib/hooks/useGetTagList";

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
  //검색
  const [searchQuery, setSearchQuery] = useState("");
  const handleDebounce = useDebounce(searchQuery, 300);

  const [serviceFilter, setServiceFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  //페이지
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, error } = useResourceData(
    page,
    pageSize,
    handleDebounce,
    serviceFilter,
    regionFilter,
    tagFilter,
  );
  const {
    data: tagList,
    isLoading: isTagListLoading,
    error: tagListError,
  } = useGetTagList();
  const filterData = [
    {
      id: "service",
      label: "서비스",
      options: SERVICE_OPTIONS,
    },
    {
      id: "region",
      label: "리전",
      options: REGION_OPTIONS,
    },
    { id: "tag", label: "태그", options: tagList?.data || [] },
  ];
  return (
    <main className="flex  w-full flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
      <section className="flex w-full items-center justify-between gap-4">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {filterData.map((filter) => (
          <FilterBar
            key={filter.id}
            label={filter.label}
            setServiceFilter={setServiceFilter}
            setRegionFilter={setRegionFilter}
            setTagFilter={setTagFilter}
            options={filter.options}
            serviceFilter={serviceFilter}
            regionFilter={regionFilter}
            tagFilter={tagFilter}
          />
        ))}
        <ExportCsvButton />
      </section>
      <CostDataTable costData={data?.data || []} />
      <Pagination
        page={page}
        totalPages={Math.ceil((data?.count || 0) / pageSize)}
        onPageChange={setPage}
      />
    </main>
  );
}
