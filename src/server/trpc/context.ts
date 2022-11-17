import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";

/* This file is where you define the context that is passed to your tRPC procedures. Context is data that all of your tRPC procedures will have access to, and is a great place to put things like database connections, authentication information, etc. In create-t3-app we use two functions, to enable using a subset of the context when we do not have access to the request object. */


type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/

  //? createContextInner: This is where you define context which doesn’t depend on the request, e.g. your database connection. You can use this function for integration testing or ssg-helpers where you don’t have a request object.
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/

// createContext: This is where you define context which depends on the request, e.g. the user’s session. You request the session using the opts.req object, and then pass the session down to the createContextInner function to create the final context.
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  console.log("inside createContext: Finding session")
  console.log("session: ", session)

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
