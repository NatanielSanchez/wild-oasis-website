"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CapacityFilter } from "../_lib/types";
import { PropsWithChildren } from "react";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = (searchParams.get("capacity") ?? "all") as CapacityFilter;

  function handleFilterChange(filter: CapacityFilter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex border border-primary-800">
      <Button onClick={() => handleFilterChange("all")} active={currentFilter === "all"}>
        All cabins
      </Button>
      <Button onClick={() => handleFilterChange("small")} active={currentFilter === "small"}>
        1&mdash;3 guests
      </Button>
      <Button onClick={() => handleFilterChange("medium")} active={currentFilter === "medium"}>
        4&mdash;7 guests
      </Button>
      <Button onClick={() => handleFilterChange("large")} active={currentFilter === "large"}>
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({
  children,
  onClick,
  active,
}: PropsWithChildren<{ active: boolean; onClick: () => void }>) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${active ? "bg-primary-500" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Filter;
