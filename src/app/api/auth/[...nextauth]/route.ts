import { supabase } from "@/lib/supabase";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "Please set NEXTAUTH_SECRET environment variable. You can generate one with: `openssl rand -base64 32`"
  );
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    error: "/auth/error",
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("=== Sign-in Process Started ===");
      console.log("User:", JSON.stringify(user, null, 2));
      console.log("Account:", JSON.stringify(account, null, 2));
      console.log("Profile:", JSON.stringify(profile, null, 2));

      if (!user.email) {
        console.error("[Auth Error] Sign-in failed: No email provided");
        return false;
      }

      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.email,
          name: user.name || "",
        })
        .select();

      if (error) {
        console.error(
          "[Database Error] Failed to save user to Supabase:",
          error
        );
        return false;
      }

      console.log("=== Sign-in Success ===");
      console.log("User saved to database:", user.email);
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user = {
          id: user.id,
          name: session.user.name,
          email: session.user.email,
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
