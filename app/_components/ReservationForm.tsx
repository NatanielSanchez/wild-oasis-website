/* eslint-disable @next/next/no-img-element */
"use client";

import { User } from "next-auth";
import { Cabin, TablesInsert } from "../_lib/supabase";
import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import { createReservation } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user }: { cabin: Cabin; user: User }) {
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;
  const startDate = range?.from;
  const endDate = range?.to;
  let numNights;
  if (startDate && endDate) numNights = differenceInDays(endDate, startDate);
  else numNights = 0;
  const cabinPrice = numNights * (regularPrice! - discount!);

  const bookingData: TablesInsert<"bookings"> = {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createReservationWithBind = createReservation.bind(null, bookingData);

  return (
    <div className="my-auto scale-[1.01]">
      <div className="flex items-center justify-between bg-primary-800 px-16 py-2 text-primary-300">
        <p>Logged in as</p>

        <div className="flex items-center gap-1">
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image || "/default-avatar.png"}
            alt={user.name || "Guest"}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          await createReservationWithBind(formData);
          resetRange();
        }}
        className="flex flex-col gap-5 bg-primary-900 px-16 py-10 text-lg"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity || 1 }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">Anything we should know about your stay?</label>
          <textarea
            name="observations"
            id="observations"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex items-center justify-end gap-6">
          {startDate && endDate ? (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          ) : (
            <p className="text-base text-primary-300">Start by selecting dates</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
