import React, { useState, useCallback } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppSelector } from "../hooks/useTypedSelector";

import { useForm, Resolver, SubmitHandler } from "react-hook-form";

import { trpc } from "../utils/trpc";
import { type ShareListSchema } from "../server/schema/listSchema";

import { HiX, HiOutlineCheck, HiPlus } from "react-icons/hi";

const resolver: Resolver<ShareListSchema> = async (values) => {
  return {
    values: !values.targetEmail ? {} : values,
    errors: !values.targetEmail
      ? {
          targetEmail: {
            type: "required",
            message: "An email is required",
          },
        }
      : {},
  };
};

const Shareform: NextPage = () => {
  const [showToast, setShowToast] = React.useState<boolean>(false);
  const { activeList, error, loading } = useAppSelector((state) => state.list);
  const { items } = useAppSelector((state) => state.item);

  const {
    handleSubmit,
    register,
    // reset,
    formState: { errors },
  } = useForm<ShareListSchema>({
    resolver,
  });

  // swap with Share list TRPC
  const { mutateAsync } = trpc.userList.shareList.useMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: ShareListSchema) => {
      try {
        // if (data) {
        //   console.log("data found on sharing: ", data);
        // }
        //hardcode pass info via Redux

        data.listId = activeList!.id;
        data.listTitle = activeList!.title;
        data.userId = activeList!.userId;

        if (items) {
          data.items = items;
          console.log("data.items: ", data.items);
          const result = await mutateAsync(data);
        }
        const result = await mutateAsync(data);
        // if (result) {
        //   setShowToast(true);
        //   setTimeout(() => {
        //     router.push("/");
        //   }, 500);
        //}
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
            <HiX className="mt-1 ml-2 h-4 w-4" />
          </Link>
          <div className="row-start-1">Share List</div>
          <div className="row-start-1">
            <button>
              {/* 
            1. Fire Submission of List
            2. Pop Up Toast saying incomplete items if rquired fields in form not fired
            3?. Possible change link from homepage ('/') to the list itself but thats a finer tuning point
            */}
              <HiOutlineCheck className="mt-1 mr-2 h-4 w-4" />
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
                <div className="pl-6 font-normal">List Shared</div>
              </div>
            ) : (
              <div></div>
            )}

            {/* Toast: End */}
            {errors?.targetEmail && (
              <p className="inline font-bold text-red-800">
                ⚠{errors.targetEmail.message}
              </p>
            )}
            <div // controls opacity of rest of active list when add item/list is selected
              className="container relative mx-auto flex h-full flex-row flex-col  p-6 px-4 pb-8 "
            >
              <div className="m-4 pb-8 text-center">{activeList!.title}</div>
              <input
                autoFocus
                autoComplete="off"
                className="flex h-20 w-full border-2 border-black text-center text-black"
                placeholder="Enter friend's email..."
                {...register("targetEmail")}
              />
            </div>
          </div>
        </div>
        {/* Form Component: End*/}
      </form>
    </div>
  );
};

export default Shareform;
