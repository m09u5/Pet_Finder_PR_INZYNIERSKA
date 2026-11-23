"use client";

import { Dropdown } from "@/components/ui/Dropdown";
import { SearchIcon } from "@/components/ui/SearchIcon";
import { buttonClass } from "@/styles/theme";
import { SearchFiltersPanel } from "./SearchFiltersPanel";
import { useSearchForm } from "./useSearchForm";

const INPUT_CLASS =
  "flex-1 min-w-0 bg-transparent px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none";

export function SearchBar() {
  const { filters, setFilter, filtersOpen, setFiltersOpen, submit } = useSearchForm();

  return (
    <Dropdown
      open={filtersOpen}
      onOpenChangeAction={setFiltersOpen}
      className="flex-1 min-w-[260px] max-w-2xl"
      trigger={
        <form
          onSubmit={submit}
          className="flex items-center border border-gray-300 rounded-full bg-gray-50 overflow-hidden"
        >
          <input
            type="text"
            placeholder="Szukaj pupila"
            value={filters.q}
            onFocus={() => setFiltersOpen(true)}
            onChange={(event) => setFilter("q", event.target.value)}
            className={INPUT_CLASS}
          />
          <div className="w-px h-6 bg-gray-300" />
          <input
            type="text"
            placeholder="Lokalizacja"
            value={filters.locationText}
            onFocus={() => setFiltersOpen(true)}
            onChange={(event) => setFilter("locationText", event.target.value)}
            className={INPUT_CLASS}
          />
          <button
            type="submit"
            className={buttonClass({ className: "m-1" })}
          >
            <SearchIcon />
            Szukaj
          </button>
        </form>
      }
    >
      <SearchFiltersPanel filters={filters} onChangeAction={setFilter} onSubmitAction={submit} />
    </Dropdown>
  );
}
