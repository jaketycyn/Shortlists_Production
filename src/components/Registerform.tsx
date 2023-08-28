import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { trpc } from "../utils/trpc";
import {
  registerSchema,
  type RegisterSchema,
} from "../server/schema/userSchema";

const RegisterForm: NextPage = () => {
  const [show, setShow] = useState({
    password: false,
    cpassword: false,
  });
  const settingShowPassword = (value: string) => {
    console.log("value: " + value);

    if (value === "password") {
      setShow({ ...show, password: !show.password, cpassword: false });
    }
    if (value === "cpassword") {
      setShow({ ...show, cpassword: !show.cpassword, password: false });

      //setShow({...show, cpassword: false})
    }
  };

  const router = useRouter();
  const { handleSubmit, register, reset } = useForm<RegisterSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const { mutateAsync } = trpc.user.registerUser.useMutation();

  const handleGoogleSignin = () => {
    signIn("google", { redirect: true }); // This should match the name of the provider as specified in [...nextauth].js
  };

  const onSubmit = useCallback(
    async (data: RegisterSchema) => {
      try {
        const result = await mutateAsync(data);
        if (result.status === 201) {
          reset();
          router.push("/");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [mutateAsync, router, reset]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <div className="mt-20 flex min-h-full items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-lg border-2  bg-white">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register a new account
            </h2>
            {/* Add this section for Google Sign-In */}
            <div className="flex flex-col py-6 text-center">
              <button
                className="group relative mx-auto flex w-3/5 justify-center rounded-md border-2 border-black px-4 py-2.5  text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 "
                onClick={handleGoogleSignin}
              >
                Sign Up with Google
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
                href={"/"}
                //onClick={toggleMember}
              >
                Sign in to an existing account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6 " onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="remember" defaultValue="true" />

            {/* Fix later with automatic error && error.message*/}
            {/* <p className="text-red-700 text-center font-bold">{error && "Email Already in Use"}</p> */}

            <div className="-space-y-px rounded-md shadow-sm">
              <div className="mt-2 text-center">
                {/* {showAlert && (
              <div className="group relative flex w-full justify-center rounded-lg border border-transparent text-white bg-indigo-600 py-2 px-4 ">
                <Alert />
              </div>
            )} */}
              </div>
            </div>

            <div>
              <div>
                <input
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Name"
                  type="text"
                  {...register("name")}
                  //   value={values.name}
                  //   onChange={handleChange}
                />
              </div>
              <div>
                <input
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="E-mail"
                  type="email"
                  {...register("email")}
                  // value={values.email}
                  // onChange={handleChange}
                />
              </div>

              <div>
                <input
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  type={`${show.password ? "text" : "password"}`}
                  onClick={() => settingShowPassword("password")}
                  {...register("password")}

                  //onClick={() => setShow({...show, password: !show.password})}
                  // {...register('password')}
                  // value={values.password}
                  // onChange={handleChange}
                />
              </div>
              {/* <div>
            <input
              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              name="cpassword"
              placeholder="Confirm Password"
              type={`${show.cpassword ? "text":"password" }`}
              onClick={() => settingShowPassword('cpassword')}
              // {...register('password')}
              // value={values.password}
              // onChange={handleChange}
            />
          </div> */}
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
                  className="group relative mt-8 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
