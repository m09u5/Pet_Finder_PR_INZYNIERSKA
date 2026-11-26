"use client";

import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { DropdownProps } from "./dropdown.types";

export function Dropdown({ open, onOpenChangeAction, trigger, children, className }: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => onOpenChangeAction(false), open);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      {trigger}
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 text-sm">
          {children}
        </div>
      )}
    </div>
  );
}
