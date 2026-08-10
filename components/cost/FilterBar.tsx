"use client";
import React from "react";
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
  return (
    <select
      value={
        label === "서비스"
          ? serviceFilter
          : label === "리전"
            ? regionFilter
            : tagFilter
      }
      onChange={(e) => {
        if (label === "서비스") {
          setServiceFilter(e.target.value);
        } else if (label === "리전") {
          setRegionFilter(e.target.value);
        } else {
          setTagFilter(e.target.value);
        }
      }}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
