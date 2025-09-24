"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

type ReservationState = {
  range?: DateRange;
};

type ReservationContextValue = ReservationState & {
  setRange: (range?: DateRange) => void;
  resetRange: () => void;
};

const ReservationContext = createContext<ReservationContextValue | null>(null);

const initialState: DateRange = { from: undefined, to: undefined };

function ReservationProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange | undefined>(initialState);

  function resetRange() {
    setRange(initialState);
  }

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

export default ReservationProvider;

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("ReservationContext was used outside of its provider!");
  else return context;
}
