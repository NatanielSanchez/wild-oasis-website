import { DefaultSession } from "next-auth";

// extend the session type to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      guestId: number;
    } & DefaultSession["user"];
  }
}
