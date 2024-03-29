import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../server/schema/userSchema";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { redirect } from "next/dist/server/api-utils";

const LoginForm: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  console.log("session: " + session);

  const { handleSubmit, register, reset } = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  let redirectUrl = "http://location:3000";

  useEffect(() => {
    const url = new URL(location.href);
    redirectUrl = url.searchParams.get("callbackUrl")!;
  });

  const handleGoogleSignin = () => {
    signIn("google", { callbackUrl: redirectUrl });

    // signIn('credentials', { email, password, callbackUrl: `${window.location.origin}/`
  };

  const onSubmit = useCallback(
    async (data: LoginSchema) => {
      try {
        await signIn("credentials", { ...data, redirect: true });

        reset();
      } catch (err) {
        console.error(err);
      }
    },
    [reset]
  );

  // useEffect(() => {
  //   console.log("Checking session...", session);
  //   if (session) {
  //     console.log("Session exists, redirecting...");
  //     router.push("/"); // Redirect to wherever you want
  //   }
  // }, [session, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
    >
      <div className="mt-20 flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-md space-y-8 rounded-lg border-2 bg-white">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>

            {/* Add this section for Google Sign-In */}
            <div className="flex flex-col py-6 text-center">
              <button
                className="group relative mx-auto flex w-3/5 justify-center rounded-md border-2 border-black px-4 py-2.5  text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 "
                onClick={handleGoogleSignin}
              >
                Sign In with Google
                <div className="flex px-2">
                  <img
                    src={"/assets/icons/google-48.png"}
                    width="20"
                    height={20}
                    className=""
                    alt="google icon"
                  />
                </div>
              </button>
            </div>
            {/* End Google Sign-In section */}
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                className="font-medium text-indigo-600 hover:text-indigo-500"
                href={"/register"}
                //onClick={toggleMember}
              >
                register a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="remember" defaultValue="true" />

            <div className="-space-y-px rounded-md shadow-sm">
              <div className="mt-2 text-center">
                {/* {showAlert && (
                <div className="group relative flex w-full justify-center rounded-lg border border-transparent text-white bg-indigo-600 py-2 px-4 ">
                  <Alert />
                </div>
              )} */}
                {/* <p>{error && error.message}</p> */}
              </div>
            </div>

            <div>
              <div>
                <input
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="E-mail"
                  type="email"
                  {...register("email")}
                  required
                />
              </div>

              <div>
                <input
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                  required
                  autoComplete="current-password"
                  // value={values.password}
                  // onChange={handleChange}
                />
              </div>
              <div className="mt-2 flex items-center  justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  className="group relative mt-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  type="submit"
                >
                  Login
                </button>
              </div>
              {/* //?Google Login 
            <div className="flex flex-col text-center py-6">
                <button  className="group relative flex w-3/5 mx-auto justify-center rounded-md border-2 border-black py-2.5 px-4  text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 "
                type="submit"
                onClick={handleGoogleSignin}
                >Sign In with Google
                  <div className="px-2 flex">
                  <Image src={'/assets/google-48.png'} width="20" height={20} className="" alt="google icon"></Image>
                  </div>
                  </button>
            </div> */}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
