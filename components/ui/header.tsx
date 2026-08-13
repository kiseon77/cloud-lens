"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header({
  Routes,
  isLoggedIn,
}: {
  Routes: { label: string; route: string }[];
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();

  const label = React.useMemo(() => {
    const currentRoute = Routes.find((route) => pathname === route.route);
    return currentRoute?.label || "";
  }, [pathname, Routes]);

  return (
    <div className="bg-gray-800 text-white p-4">
      <Link href={isLoggedIn ? "/" : "/login"} className="hover:opacity-80">
        CloudLens
      </Link>
      {isLoggedIn && <> ・ {label}</>}
    </div>
  );
}
