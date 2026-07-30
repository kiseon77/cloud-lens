import React from "react";
//표시할 컬럼 선택 드롭다운
export default function SortableColumnHeader({ title }: { title: string }) {
  return <div className="flex items-center gap-2 bg-amber-100">{title}</div>;
}
