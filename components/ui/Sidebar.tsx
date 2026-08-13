"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SIDEBAR_WIDTH_STORAGE_KEY = "cloudlens:sidebar-width";
const DEFAULT_WIDTH = 240;
const MIN_WIDTH = 160;
const MAX_WIDTH = 480;

export default function Sidebar({
  labels,
}: {
  labels?: { label: string; route: string }[];
}) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // 서버 렌더와 클라이언트 첫 렌더 결과를 동일하게 유지하기 위해(hydration
  // mismatch 방지), localStorage 값은 마운트 이후 effect에서 반영합니다.
  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    if (!Number.isNaN(parsed)) {
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed)));
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (e: PointerEvent) => {
      const navLeft = navRef.current?.getBoundingClientRect().left ?? 0;
      const nextWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, e.clientX - navLeft),
      );
      setWidth(nextWidth);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      setWidth((current) => {
        window.localStorage.setItem(
          SIDEBAR_WIDTH_STORAGE_KEY,
          String(current),
        );
        return current;
      });
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <nav
      ref={navRef}
      className="relative shrink-0 bg-gray-200 md:h-full"
      style={{ "--sidebar-width": `${width}px` } as React.CSSProperties}
      data-slot="sidebar"
    >
      <div className="flex flex-row md:h-full md:w-(--sidebar-width) md:flex-col">
        {labels?.map((label) => (
          <SidebarItem
            key={label.route}
            label={label.label}
            route={label.route}
          />
        ))}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="사이드바 너비 조절"
        onPointerDown={handlePointerDown}
        className="absolute top-0 right-0 hidden h-full w-1 cursor-col-resize touch-none hover:bg-primary/40 active:bg-primary/60 md:block"
        data-resizing={isResizing || undefined}
      />
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
