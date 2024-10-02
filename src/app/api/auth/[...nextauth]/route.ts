import { config } from "@/config";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
  ],
  // show custom authentication pages instead of default given by next-auth
  pages: {
    signIn: "/auth/signIn",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
