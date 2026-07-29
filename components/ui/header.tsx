"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header({
  Routes,
}: {
  Routes: { label: string; route: string }[];
}) {
  const pathname = usePathname();

  const label = React.useMemo(() => {
    const currentRoute = Routes.find((route) => pathname === route.route);
    return currentRoute?.label || "";
  }, [pathname, Routes]);

  return <div className="bg-gray-800 text-white p-4">CloudLens ・ {label}</div>;
}
