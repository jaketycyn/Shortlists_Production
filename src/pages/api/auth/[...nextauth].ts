import NextAuth, { User, type NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
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
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { googleId: credentials.id },
        });

        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              googleId: credentials.id,
              email: credentials.email,
              username: credentials.name,
              // Any other data you want to save for Google users
            },
          });
          return newUser;
        }
        return user;
      },
    }),

    //! Add Discord Provider && find discord client id and secret
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),

    // ...add more providers here
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // console.log("credentials: ", credentials)

          if (!credentials || !credentials.email || !credentials.password)
            return null;

          const { email, password } = await loginSchema.parseAsync(credentials);

          const dbUser = await prisma.user.findFirst({
            where: { email },
          });

          console.log("result in Authorize: ", dbUser);

          if (!dbUser) return null;

          const isValidPassword = await verify(dbUser.password, password);

          if (!isValidPassword) return null;

          // console.log("dbUser: ", dbUser);
          // console.log("id: ", dbUser.id);
          // console.log("email: ", dbUser.email);
          // console.log("username: ", dbUser.username);
          return {
            id: dbUser.id,
            email: dbUser.email,
            username: dbUser.username,
          };
        } catch {
          return null;
        }
      },
    }),
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
