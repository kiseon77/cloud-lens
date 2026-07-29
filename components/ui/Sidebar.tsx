"use client";
import Link from "next/link";

export default function Sidebar({
  labels,
}: {
  labels?: { label: string; route: string }[];
}) {
  return (
    <nav className="bg-gray-200 ">
      {labels?.map((label) => (
        <SidebarItem
          key={label.route}
          label={label.label}
          route={label.route}
        />
      ))}
    </nav>
  );
}

function SidebarItem({ label, route }: { label: string; route: string }) {
  return (
    <Link
      className="p-4 hover:bg-gray-300 cursor-pointer w-full flex items-center justify-center md:justify-start"
      href={route}
    >
      {label}
    </Link>
  );
}
