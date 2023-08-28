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
    jwt: async ({ token, user, account, profile }) => {
      if (account) {
        if (account.provider === "google" && profile) {
          console.log("account ", account);
          console.log("account.provider: ", account.provider);
          console.log("profile: ", profile);
          // Check if a user already exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });
          if (existingUser) {
            // Here you can decide what to do.
            // For example, you can merge this Google account with the existing account
            // or you can throw an error to prevent duplicate accounts.
          }
          if (!existingUser) {
            // Create a new user in your database
            // Note: You'll need to handle this securely; this is just a simple example
            const newUser = await prisma.user.create({
              data: {
                email: profile.email!,
                name: profile.name!,
                // You may want to store the Google ID or other information here
              },
            });
            token.newUser = true;
            token.sub = newUser.id; // set the JWT 'sub' claim to the new user's ID
          }
        }
      }

      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      console.log("Redirecting...", { url, baseUrl });
      return "http://localhost:3000";
      // return Promise.resolve(baseUrl);
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
    // ... other callbacks
  },
  // Configure one or more authentication providers

  providers: [
    Credentials({
      id: "credentials",
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
          console.log("credentials: ", credentials);

          const { email, password } = await loginSchema.parseAsync(credentials);
          const result = await prisma.user.findFirst({
            where: { email },
          });
          console.log("result in Authorize: ", result);

          if (!result || !result.password) {
            return null;
          }

          const isValidPassword = await verify(result.password, password);
          return {
            id: result.id,
            email: result.email,
            name: result.name,
          };
        } catch {
          // If you return null or false then the credentials will be rejected
          return null;
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
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

//https://stackoverflow.com/questions/69424685/custom-sign-in-page-not-redirecting-correctly-in-next-auth

export default NextAuth(authOptions);
