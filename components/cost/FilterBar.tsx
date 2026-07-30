"use client";
import React from "react";
//서비스/리전/태그(Team, Environment) 다중 선택 필터, 상태를 URL 쿼리 파라미터와 동기화
export default function FilterBar({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => {
        console.log(e.target.value);
      }}
    >
      hh
      {label}
      <option value="service">서비스</option>
      <option value="region">리전</option>
      <option value="tag">태그</option>
    </select>
  );
}
