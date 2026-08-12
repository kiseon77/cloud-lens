// useFormattedNumber.ts
export default function useFormattedNumber(value: string | number) {
  if (value === null || value === undefined || value === "") return "";

  const cleanNumberString = String(value).replace(/[^0-9]/g, "");

  if (!cleanNumberString) return "";

  return Number(cleanNumberString).toLocaleString("en-US");
}
