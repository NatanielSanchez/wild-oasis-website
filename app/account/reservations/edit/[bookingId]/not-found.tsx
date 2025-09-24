import Link from "next/link";

function NotFound() {
  return (
    <main className="mt-4 space-y-6 text-center">
      <h1 className="text-3xl font-semibold">Booking not found</h1>
      <Link
        href="/account/reservations"
        className="inline-block bg-accent-500 px-6 py-3 text-lg text-primary-800"
      >
        Browse your reservations
      </Link>
    </main>
  );
}

export default NotFound;
