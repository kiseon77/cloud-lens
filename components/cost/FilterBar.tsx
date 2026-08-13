"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ALL_VALUE = "__all__";

//서비스/리전/태그(Team, Environment) 다중 선택 필터, 상태를 URL 쿼리 파라미터와 동기화
export default function FilterBar({
  label,
  setServiceFilter,
  setRegionFilter,
  setTagFilter,
  options,
  serviceFilter,
  regionFilter,
  tagFilter,
}: {
  label: string;
  options: readonly string[];
  setServiceFilter: React.Dispatch<React.SetStateAction<string>>;
  setRegionFilter: React.Dispatch<React.SetStateAction<string>>;
  setTagFilter: React.Dispatch<React.SetStateAction<string>>;
  serviceFilter: string;
  regionFilter: string;
  tagFilter: string;
}) {
  const currentValue =
    label === "서비스"
      ? serviceFilter
      : label === "리전"
        ? regionFilter
        : tagFilter;

  const handleChange = (value: string | null) => {
    const next = !value || value === ALL_VALUE ? "" : value;
    if (label === "서비스") {
      setServiceFilter(next);
    } else if (label === "리전") {
      setRegionFilter(next);
    } else {
      setTagFilter(next);
    }
  };

  return (
    <Select value={currentValue || ALL_VALUE} onValueChange={handleChange}>
      <SelectTrigger className="w-35">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>{label} 전체</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
