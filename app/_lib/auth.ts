import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const config: NextAuthConfig = {
  providers: [
    Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const guest = await getGuest(user.email);
        if (!guest) await createGuest({ fullName: user.name, email: user.email });
        return true;
      } catch {
        return false;
      }
    },
    async session({ session }) {
      const guest = await getGuest(session.user.email);
      if (!guest) throw new Error("Failed to load session: Guest not loaded correctly.");
      session.user.guestId = guest.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
