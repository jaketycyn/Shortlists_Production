import NextAuth, { User, type NextAuthOptions } from "next-auth";
//import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { loginSchema } from "../../../server/schema/userSchema";
import { Session } from "inspector";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

//had to do any to get rid of type error to allow upload to Vercel
//see the docs here and below in session for more info
//https://github.com/nextauthjs/next-auth/discussions/2979
//https://next-auth.js.org/getting-started/typescript#module-augmentation
type ExtendedUserType = User & { id?: any };

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      //console.log("token: ", token);

      return token;
    },
    session: async ({ session, token }) => {
      if (session && token) {
        //?logic for adding user.id from token to session
        // https://next-auth.js.org/getting-started/client
        // https://next-auth.js.org/configuration/callbacks#session-callback
        (session.user as ExtendedUserType).id = token.sub;
      }

      return session;
    },
  },
  // Configure one or more authentication providers

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // console.log("credentials: ", credentials)

          const { email, password } = await loginSchema.parseAsync(credentials);

          const result = await prisma.user.findFirst({
            where: { email },
          });
          // console.log("result: ", result)

          if (!result) return null;

          const isValidPassword = await verify(result.password, password);

          if (!isValidPassword) return null;

          // console.log("result: ", result);
          // console.log("id: ", result.id);
          // console.log("email: ", result.email);
          // console.log("username: ", result.username);
          return {
            id: result.id,
            email: result.email,
            username: result.username,
          };
        } catch {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
    newUser: "/register",
  },
};

export default NextAuth(authOptions);
