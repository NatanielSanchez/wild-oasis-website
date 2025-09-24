/* eslint-disable @next/next/no-img-element */
"use client";

import { ReactNode } from "react";
import { Guest } from "../_lib/supabase";
import { updateGuestProfile } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function UpdateProfileForm({ children, guest }: { children: ReactNode; guest: Guest }) {
  const { fullName, nationalId, countryFlag, email } = guest;

  return (
    <form
      action={updateGuestProfile}
      className="flex flex-col gap-6 bg-primary-900 px-12 py-8 text-lg"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          name="fullName"
          defaultValue={fullName || ""}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          name="email"
          defaultValue={email || ""}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <img src={countryFlag || undefined} alt="Country flag" className="h-5 rounded-sm" />
        </div>
        {children} {/*server component here! */}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalId">National ID number</label>
        <input
          name="nationalId"
          defaultValue={nationalId || ""}
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
        />
      </div>

      <div className="flex items-center justify-end gap-6">
        <SubmitButton pendingLabel="Updating...">Update profile</SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
