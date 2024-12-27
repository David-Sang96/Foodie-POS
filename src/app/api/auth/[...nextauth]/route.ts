import { config } from "@/config";
import { createDefaultData, getUser } from "@/libs/actions";
import NextAuth, { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

interface Props {
  user: User | AdapterUser;
}

const authOptions = {
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
  callbacks: {
    // run this fn between, after sign in with google and before going to home page
    async signIn({ user }: Props) {
      const email = user.email as string;
      const userFromDB = await getUser(email);
      if (!userFromDB) {
        await createDefaultData(user);
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
