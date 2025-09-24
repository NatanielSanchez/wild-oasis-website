"use client";

import { PropsWithChildren, ReactNode } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ children, pendingLabel }: PropsWithChildren<{ pendingLabel: ReactNode }>) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-accent-500 px-8 py-4 font-semibold text-primary-800 transition-all hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
export default SubmitButton;
