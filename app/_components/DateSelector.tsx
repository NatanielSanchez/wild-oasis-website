"use client";

import { differenceInDays, isPast, isSameDay, isWithinInterval } from "date-fns";
import { DateRange, DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Cabin, Settings } from "../_lib/supabase";
import { useReservation } from "./ReservationContext";

type DateSelectorProps = {
  settings: Settings;
  bookedDates: Date[];
  cabin: Cabin;
};

function isAlreadyBooked(range: DateRange | undefined, datesArr: Date[]) {
  return (
    range?.from &&
    range.to &&
    datesArr.some((date) => isWithinInterval(date, { start: range.from!, end: range.to! }))
  );
}

function DateSelector({ settings, bookedDates, cabin }: DateSelectorProps) {
  const defaultClassNames = getDefaultClassNames();
  const { range, setRange, resetRange } = useReservation();
  const startMonth = new Date();
  const endMonth = new Date(
    startMonth.getFullYear() + 2,
    startMonth.getMonth(),
    startMonth.getDate(),
  );

  const displayRange: DateRange | undefined = isAlreadyBooked(range, bookedDates)
    ? { from: undefined, to: undefined }
    : range;

  const { regularPrice, discount } = cabin;
  let numNights;
  if (displayRange && displayRange.from && displayRange.to)
    numNights = differenceInDays(displayRange.to, displayRange.from);
  else numNights = 0;
  const cabinPrice = numNights * (regularPrice! - discount!);

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="place-self-center pt-8"
        mode="range"
        min={minBookingLength ? minBookingLength + 1 : 1}
        max={maxBookingLength || undefined}
        startMonth={new Date()}
        endMonth={endMonth}
        captionLayout="dropdown"
        numberOfMonths={2}
        onSelect={setRange}
        selected={displayRange}
        disabled={(curDate) =>
          isPast(curDate) || bookedDates.some((date) => isSameDay(date, curDate))
        }
        classNames={{
          months: `${defaultClassNames.months} flex-col`,
          day_button: `${defaultClassNames.day_button} hover:bg-accent-500`,
        }}
      />

      <div className="flex h-[72px] items-center justify-between bg-accent-500 px-8 text-primary-800">
        <div className="flex items-baseline gap-6">
          <p className="flex items-baseline gap-2">
            {discount !== null && discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice! - discount}</span>
                <span className="font-semibold text-primary-700 line-through">${regularPrice}</span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 px-4 py-2 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
