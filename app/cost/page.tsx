"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import CostDataTable from "@/components/cost/CostDataTable";
import ExportCsvButton from "@/components/cost/ExportCsvButton";
import FilterBar from "@/components/cost/FilterBar";
import Pagination from "@/components/cost/Pagination";
import SearchInput from "@/components/cost/SearchInput";

import { useDebounce } from "@/lib/hooks/useDebounce";
import { REGION_OPTIONS, SERVICE_OPTIONS } from "@/lib/constants";
import useGetTagList from "@/lib/hooks/useGetTagList";
import useResourceData from "@/lib/hooks/useResourceCosts";

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
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col gap-4 py-10 px-8">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <CostDataTable data={data?.data || []} />
            <Pagination
              page={page}
              totalPages={Math.ceil((data?.count || 0) / pageSize)}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
