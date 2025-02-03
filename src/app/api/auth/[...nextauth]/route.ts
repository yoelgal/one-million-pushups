import { supabase } from "@/lib/supabase";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.email,
          name: user.name || "",
        })
        .select();

      if (error) {
        console.error("Error saving user to Supabase:", error);
        return false;
      }

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
