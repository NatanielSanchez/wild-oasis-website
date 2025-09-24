"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase, TablesInsert } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  // on log in, redirect to account page
  await signIn("google", { redirectTo: "/account" });
}
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
export async function updateGuestProfile(formData: FormData) {
  // check authorization/authentication
  const session = await auth();
  if (!session) throw new Error("Not authenticated to invoke server action updateGuestProfile.");

  // get form data...
  const nationalId = formData.get("nationalId") as string;
  const countryData = formData.get("nationality") as string;
  const [nationality, countryFlag] = countryData.split("%");

  // ... and validate it! (or some of it)
  if (!/^[A-Za-z0-9]{6,12}$/.test(nationalId))
    throw new Error("Invalid national id passed to server action updateGuestProfile.");

  // mutate!
  const { error } = await supabase
    .from("guests")
    .update({ nationalId, nationality, countryFlag })
    .eq("id", session.user.guestId);
  if (error) throw new Error("Guest could not be updated on server action updateGuestProfile.");

  // revalidate browser cache for this route only (and subroutes if it has them)
  revalidatePath("/account/profile");
}

export async function createReservation(bookingData: TablesInsert<"bookings">, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated to invoke server action createReservation.");

  const numGuests = Number(formData.get("numGuests"));
  if (isNaN(numGuests))
    throw new Error(
      "Unexpected parameter passed to server action createReservation - numGuests:" + numGuests,
    );

  const newBooking: TablesInsert<"bookings"> = {
    ...bookingData,
    observations: (formData.get("observations") as string).slice(0, 1000),
    numGuests,
    guestId: session.user.guestId,
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: "unconfirmed",
    hasBreakfast: false,
    isPaid: false,
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created on server action createReservation.");

  revalidatePath("/account/reservations");
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function deleteReservation(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated to invoke server action deleteReservation.");

  // verify if this bookingId actually belongs to the logged in user!
  const bookings = await getBookings(session.user.guestId);
  if (!bookings.some((b) => b.id === bookingId))
    throw new Error(
      "Not authorized to invoke server action deleteReservation: booking ID does not belong to user.",
    );

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);
  if (error) throw new Error("Booking could not be deleted on server action deleteReservation.");

  revalidatePath("/account/reservations");
}

export async function updateReservation(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated to invoke server action updateReservation.");

  const id = Number(formData.get("id"));
  if (isNaN(id))
    throw new Error("Unexpected ID" + id + " passed to server action updateReservation");

  const bookings = await getBookings(session.user.guestId);
  if (!bookings.some((b) => b.id === id))
    throw new Error(
      "Not authorized to invoke server action updateReservation: booking ID does not belong to user.",
    );

  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations") as string;

  const { error } = await supabase
    .from("bookings")
    .update({ id, numGuests, observations: observations.slice(0, 1000) })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated on server action updateReservation.");

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${id}`);
  redirect("/account/reservations");
}
