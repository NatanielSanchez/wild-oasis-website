/* eslint-disable @typescript-eslint/no-unused-vars */
import { eachDayOfInterval } from "date-fns";
import { Country } from "./types";
import { supabase, TablesInsert } from "./supabase";
import { notFound } from "next/navigation";

// for testing
// await new Promise((res) => setTimeout(res, 1000));

/////////////
// GET

export async function getCabin(id: number | string) {
  const cabinId = Number(id);
  if (isNaN(cabinId)) notFound(); // supabase needs a number

  const { data, error } = await supabase.from("cabins").select("*").eq("id", cabinId).single();

  if (error) {
    console.error(error);
    // throws if no data is found as well
    notFound();
  }

  return data;
}

export async function getCabinPrice(id: number) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data, error } = await supabase.from("guests").select("*").eq("email", email).single();

  // no error here, handle the possibility of no guest in the sign in callback on auth.ts
  // supabase throws if the query returns null
  return data;
}

export async function getBooking(id: number | string) {
  const bookingId = Number(id);
  if (isNaN(bookingId)) notFound();

  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId: number) {
  const { data, error, count } = await supabase
    .from("bookings")
    // also need data on the cabins as well, but only take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today.toISOString()},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .filter((booking) => booking.startDate && booking.endDate)
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate!),
        end: new Date(booking.endDate!),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch("https://restcountries.com/v2/all?fields=name,flag");
    const countries = (await res.json()) as Country[];
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: TablesInsert<"guests">) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

/*

these functions are used as reference only

export async function createBooking(newBooking: TablesInsert<"bookings">) {
  const { data, error } = await supabase.from("bookings").insert([newBooking]).select().single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/*

/////////////
// UPDATE

// the updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
*/
