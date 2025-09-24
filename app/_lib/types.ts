import { getBookings } from "./data-service";

export type Country = {
  name: string;
  flag: string;
  independent: boolean;
};

export type CapacityFilter = "small" | "medium" | "large" | "all";

export type BookingReservation = Awaited<ReturnType<typeof getBookings>>[number];
