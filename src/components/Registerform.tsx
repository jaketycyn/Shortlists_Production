import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const { mutateAsync } = trpc.user.registerUser.useMutation();

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
    <div className="mt-20 flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="w-full max-w-md space-y-8 bg-white">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Register a new account
          </h2>
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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="Username"
                type="text"
                {...register("username")}
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
                className="group relative mt-8 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                type="submit"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
