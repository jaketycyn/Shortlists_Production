import NextAuth, {
  type DefaultSession,
  type DefaultUser,
  JWT,
  User,
} from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name: string;
      newUser?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
  }
}
