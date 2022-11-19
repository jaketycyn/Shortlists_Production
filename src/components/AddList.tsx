import React, { useState, useCallback } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { addListSchema, type AddListSchema } from "../server/schema/listSchema";

import { HiX, HiOutlineCheck, HiPlus } from "react-icons/hi";

// const resolver: Resolver<AddListSchema> = async (values) => {
//   return {
//     values: !values.listTitle ? {} : values,
//     errors: !values.listTitle
//       ? {
//           listTitle: {
//             type: "required",
//             message: "A title is required",
//           },
//         }
//       : {},
//   };
// };

// const router = useRouter();
// const { handleSubmit, register, reset } = useForm<RegisterSchema>({
//   defaultValues: {
//     username: "",
//     email: "",
//     password: "",
//   },
//   resolver: zodResolver(registerSchema),
// });

// const { mutateAsync } = trpc.user.registerUser.useMutation()

// const onSubmit = useCallback(
//   async (data: RegisterSchema) => {
//     try {
//       const result = await mutateAsync(data);
//       if (result.status === 201) {
//         reset();
//         router.push("/");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   },
//   [mutateAsync, router, reset]
// );

const AddList: NextPage = () => {
  const [showToast, setShowToast] = React.useState<boolean>(false);
  const {
    handleSubmit,
    register,
    // reset,
    formState: { errors },
  } = useForm<AddListSchema>({
    resolver: zodResolver(addListSchema),
  });

  const { mutateAsync } = trpc.userList.addList.useMutation();

  const router = useRouter();

  const onSubmit = useCallback(
    async (data: AddListSchema) => {
      try {
        const result = await mutateAsync(data);
        if (result) {
          router.push("/");
        }
        console.log("result: ", result);
      } catch (err) {
        console.error(err);
      }
    },
    [mutateAsync, router]
  );

  // const onSubmit: SubmitHandler<ListFormInputs> = (data) => {
  //   console.log("data: ", data);

  //   if (data) {
  //     setShowToast(true);
  //     return {
  //       redirect: {},
  //     };
  //   }
  // };

  return (
    <div className="h-full">
      <form
        className="items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
        <header className="border-grey sticky top-0 grid w-full grid-rows-1 border-b p-4 text-center">
          {/* This should redirect to previous page (historical page) not "/"  */}
          <Link href="/" className="row-start-1">
            <HiX className="mt-1 h-4 w-4" />
          </Link>
          <div className="row-start-1">Title</div>
          <div className="row-start-1">
            <button>
              {/* 
            1. Fire Submission of List
            2. Pop Up Toast saying incomplete items if rquired fields in form not fired
            3?. Possible change link from homepage ('/') to the list itself but thats a finer tuning point
            */}
              <HiOutlineCheck className="mt-1 h-4 w-4" />
            </button>
          </div>
        </header>
        {/* Form Component: Start*/}
        <div
          className="relative mt-2 h-full"
          //onClick={() => setAddItemOrList(false)}
        >
          <div className="flex flex-col items-center">
            {/* Toast: Start*/}
            {showToast ? (
              <div
                id="toast-simple"
                className="flex h-14 w-60 items-center space-x-4 divide-x divide-gray-200 rounded-lg bg-green-400 p-4 text-black shadow"
                role="alert"
              >
                <HiPlus />
                <div className="pl-6 font-normal">List Created</div>
              </div>
            ) : (
              <div></div>
            )}

            {/* Toast: End */}
            {errors?.listTitle && (
              <p className="inline font-bold text-red-800">
                ⚠{errors.listTitle.message}
              </p>
            )}
            <div // controls opacity of rest of active list when add item/list is selected
              className="container relative mx-auto flex h-full flex-row  p-6 px-4 pb-8 "
            >
              <input
                autoFocus
                className="flex h-20 w-full border-2 border-black text-center text-black"
                placeholder="Enter List Name"
                {...register("listTitle")}
              />
            </div>
          </div>
        </div>
        {/* Form Component: End*/}
      </form>
    </div>
  );
};

export default AddList;
