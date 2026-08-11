"use client";

export const useMonthCalculation = (getMonthNumber: number) => {
  const now = new Date();

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(getMonthNumber).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const start = toDateStr(new Date(now.getFullYear(), now.getMonth(), 1));
  const end = toDateStr(new Date(now.getFullYear(), now.getMonth() + 1, 0));

  return { start, end };
};
