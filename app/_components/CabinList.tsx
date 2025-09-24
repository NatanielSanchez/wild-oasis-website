import { unstable_noStore as noStore } from "next/cache";
import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";
import { CapacityFilter } from "../_lib/types";

async function CabinList({ filter }: { filter: CapacityFilter }) {
  noStore();

  const cabins = await getCabins();

  if (!cabins || cabins.length === 0) return null;

  let displayedCabins;
  switch (filter) {
    case "small":
      displayedCabins = cabins.filter((cabin) =>
        cabin.maxCapacity ? cabin.maxCapacity <= 3 : false,
      );
      break;
    case "medium":
      displayedCabins = cabins.filter((cabin) =>
        cabin.maxCapacity ? cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7 : false,
      );
      break;
    case "large":
      displayedCabins = cabins.filter((cabin) =>
        cabin.maxCapacity ? cabin.maxCapacity >= 8 : false,
      );
      break;
    default:
      displayedCabins = cabins;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
