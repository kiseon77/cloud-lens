"use client";

// getMonthNumber: 1(1월)~12(12월) 기준 월. 0 이하(예: 1월의 전월)는
// 전년도로 자동 보정된다.
export const useMonthCalculation = (getMonthNumber: number) => {
  const now = new Date();
  // Date는 month를 0-indexed로 받으므로 1 빼서 전달하고,
  // 0 이하/13 이상 값은 Date 생성자가 연도를 자동으로 보정해준다.
  const year = now.getFullYear();
  const monthIndex = getMonthNumber - 1;

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const start = toDateStr(new Date(year, monthIndex, 1));
  const end = toDateStr(new Date(year, monthIndex + 1, 0));

  return { start, end };
};
