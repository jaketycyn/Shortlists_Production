import { type GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  console.log("authOptions.session: ", authOptions.session)
  console.log("authOptions ", authOptions)

  //new stuff
  if (!authOptions.session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session: authOptions.session,
    },
  }
  //end of new stuff experimenting

  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};

