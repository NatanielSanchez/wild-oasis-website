import "@/app/_styles/globals.css";
import { Metadata } from "next";

import { Josefin_Sans } from "next/font/google";
import Header from "./_components/Header";
import ReservationProvider from "./_components/ReservationContext";

const josefin = Josefin_Sans({ subsets: ["latin"], display: "swap" });

// header metadata goes in this object
export const metadata: Metadata = {
  title: { template: "%s - The Wild Oasis", default: "The Wild Oasis" },
  description: "Luxurious cabin complex, located at the heart of the Italian countryside.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} flex min-h-screen flex-col bg-primary-950 text-primary-100 antialiased`}
      >
        <Header />
        <div className="grid flex-1 px-8 py-12">
          <main className="mx-auto w-full max-w-7xl">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
